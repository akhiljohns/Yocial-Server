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
          { token: token }
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

    const message = `${process.env.BASE_URL}/auth/verify/${userId}/${token}`;
    const response = await sentEmail(email, username, message);

    return { status: 200, message: "Email sent successfully", data: response };
  } catch (error) {
    console.error("Error in verificationEmail:", error);
    return { status: 500, message: "Internal Server Error", error: error };
  }
};

///////////// password management ///////////////

export const generateTokenForPassword = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = crypto.randomBytes(32).toString('hex');
      const verify = new Verify({
        username: data?.username,
        email: data?.email,
        token: token,
        password: data?.password
      })

      await verify.save();

      const verificationLink = `${process.env.BASE_URL}/auth/change-password/verify/${data?.username}/${token}`;

      sentVerificationEmail(data?.email, data?.username, verificationLink).then((response)=> {
        resolve(response);
      }).catch((error)=> {
        reject(error);
      })

    } catch (error) {
        reject(error);
    }
  })
}