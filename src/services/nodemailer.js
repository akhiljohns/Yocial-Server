import crypto from "crypto";
import { Verify } from "../models/verifyModel.js";
import { sentEmail, sentVerificationEmail } from "./sentmail.js";

export const verificationEmail = async (email, username, userId) => {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    // const thirtyMinutesAgo = new Date(Date.now() - 10 * 1000);

    let existingToken = await Verify.findOne({
      email: email,
    });

    let token;

    if (existingToken) {
      if (existingToken.createdAt >= thirtyMinutesAgo) {
        token = existingToken.token;
      } else {
        existingToken.token = crypto.randomBytes(32).toString("hex");
        token = existingToken.token;
        const newToken = await Verify.findOneAndUpdate(
          { email: email },
          { token: token, userId: userId }
        );
      }
    } else {
      token = crypto.randomBytes(32).toString("hex");

      const newToken = new Verify({
        email: email,
        username: username,
        token: token,
      });
      await newToken.save();
    }

    const message = `${process.env.CLIENT_URL}/auth/verify/${userId}/${token}/register`;
    const response = await sentEmail(email, username, message);

    return { status: 200, message: "Email sent successfully", data: response };
  } catch (error) {
    console.error("Error in verificationEmail:", error);
    return { status: 500, message: "Internal Server Error", error: error };
  }
};

///////////// CHANGE EMAIL VERIFICATION ///////////////
// export const verifyEmailChange = async ({
//   email,
//   username,
//   userId,
//   newEmail,
//   type
// }) => {
// console.log("-------->",email, username, userId, newEmail, type)
//   try {
//     const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
//     // const thirtyMinutesAgo = new Date(Date.now() - 10 * 1000);

//     let existingToken = await Verify.findOne({
//       userId: userId,
//     });

//     let token;

//     if (existingToken && existingToken?.token2 !== null) {
//       if (existingToken?.token2CreatedAt <= thirtyMinutesAgo) {
//         token = existingToken?.token2;
//       } else {
//         existingToken.token2 = crypto.randomBytes(32).toString("hex");
//         token = existingToken?.token2;
//         const newToken = await Verify.findOneAndUpdate(
//           { userId },
//           { token2: token, userId: userId, newEmail: newEmail }
//           );
//         }
//       } else {
//       const createdAt = new Date(Date.now());
//       token = crypto.randomBytes(32).toString("hex");
//       const newToken = await Verify.findOneAndUpdate(
//         { email },
//         { token2: token, userId: userId, newEmail: newEmail , token2CreatedAt: createdAt , token2used: false }
//       );
//     }
// let update = true;
//     const message = `${process.env.CLIENT_URL}/auth/verify/${userId}/${token}/${type}`;
//     const response = await sentEmail(newEmail, username, message , update);

//     return { status: 200, message: "A Verification Email has been sent, Check your mail inbox for further details", data: response };
//   } catch (error) {
//     console.error("Error in verificationEmail:", error);
//     return { status: 500, message: "Internal Server Error", error: error };
//   }
// };

export const verifyEmailChange = async ({
  email,
  username,
  userId,
  newEmail,
  type,
}) => {
  try {
    let token;
    // Update new email in the Verify database
    let existingToken = await Verify.findOne({ userId: userId });
    if (existingToken) {
      existingToken.newEmail = newEmail;
      token = existingToken.token2;
      await existingToken.save();
    } else {
      // Create a new verification token entry
      token = crypto.randomBytes(32).toString("hex");
      const createdAt = new Date();
      const newToken = new Verify({
        userId: userId,
        newEmail: newEmail,
        token2: token,
        token2CreatedAt: createdAt,
        token2used: false,
      });
      await newToken.save();
    }

    // Send confirmation email
    let update = true;
    const message = `${process.env.CLIENT_URL}/auth/verify/${userId}/${token}/${type}`;
    const response = await sentEmail(newEmail, username, message, update);

    return {
      status: 200,
      message: "Email has been updated successfully",
      data: response,
    };
  } catch (error) {
    console.error("Error in updateEmailWithoutVerification:", error);
    return { status: 500, message: "Internal Server Error", error: error };
  }
};

///////////// password management ///////////////

export const generateTokenForPassword = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = crypto.randomBytes(32).toString("hex");
      const verify = new Verify({
        username: data?.username,
        email: data?.email,
        token: token,
        password: data?.password,
      });

      await verify.save();

      const verificationLink = `${process.env.BASE_URL}/auth/change-password/verify/${data?.username}/${token}`;

      sentVerificationEmail(data?.email, data?.username, verificationLink)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};
