import bcrypt, { hash } from "bcrypt"; //imporing bcrypt
const saltRounds = 10; //setting salt rounds
import generateJwt from "../services/jwt.js"; //imporing jwt

// importing models
import User from "../models/userModel.js"; //userModel
import { Connection } from "../models/connectionModel.js"; //CollectionModel
import { Verify } from "../models/verifyModel.js";

import {
  generateTokenForPassword,
  verificationEmail,
} from "../services/nodemailer.js";

////////////////////////////////////////////////// USER LOGIN & REGISTRATION //////////////////////////////////////////////////////////////////
// @desc    Login user
// @route   POST /users/login
// @access  Public
export const userLogin = async ({ credential, password }) => {
  try {
    // Identifying credential is email/phone
    let query = {};

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credential)) {
      // If the credential follows a basic email format, consider it as an email
      query = { email: credential };
    } else if (/^\d+$/.test(credential)) {
      // If the credential contains only numbers, consider it as a phone
      query = { phone: credential };
    } else if (/^[a-zA-Z0-9_-]+$/.test(credential)) {
      // If the credential contains only letters, numbers, underscore, and hyphen, consider it as a username
      query = { username: credential };
    } else {
      // If none of the above conditions are met, you can handle it based on your requirements
      throw { status: 400, message: "Invalid credential format" };
    }

    const user = await User.findOne(query);

    if (!user) {
      throw {
        status: 422,
        message: "Account Does Not Exist",
        error_code: "USER_NOT_FOUND",
      };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw { status: 403, message: "Wrong Password" };
    }

    if (user.blocked) {
      throw { status: 403, message: "Your Account Is Temporarily Blocked" };
    }

    const tokens = await generateJwt(user);
    user.password = null;

    return {
      status: 200,
      message: "Login Successful",
      tokens,
      user,
    };
  } catch (error) {
    console.error("Error in userLogin:", error);
    return {
      error_code: error.error_code || "INTERNAL_SERVER_ERROR",
      message: error.message || "Something Went Wrong, Try After Sometime",
      status: error.status || 500,
    };
  }
};

// @desc    Register user
// @route   POST /users/register
// @access  Public
export const registration = async ({
  fname,
  lname,
  username,
  email,
  password,
  phone,
}) => {
  try {
    // Check if username exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.log("Username Taken");
      return {
        status: 409,
        error_code: "USERNAME_TAKEN",
        message: "Username already in use",
      };
    }

    // Check if email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log("Email already registered");
      return {
        status: 409,
        error_code: "EMAIL_ALREADY_REGISTERED",
        message: "Email has already been registered",
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      name: fname+" "+lname,
      phone: phone ? phone : null,
    });

    console.log(newUser);

    // Save the user to the database
    await newUser.save();

    return {
      status: 200,
      message: "Account Created Successfully",
    };
  } catch (error) {
    console.error(`Error during registration: ${error}`);

    return {
      error_code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong, try again later",
      status: 500,
    };
  }
};

////////////////////////////////////////////////// USER FETCH //////////////////////////////////////////////////////////////////
// @desc    Get users
// @route   GET /user/fetch-users
// @access  Public
export const fetchUserById = (userId) => {
  return new Promise((resolve, reject) => {
    try {
      userId = userId.trim();
      let query = {};
      if (userId && userId !== undefined) {
        query = { _id: userId };
      }

      User.find(query)
        .select("-password")
        .exec()
        .then((user) => {
          resolve(user);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

////////////////////////////////////////////////// CONNECTION SECTION //////////////////////////////////////////////////////////////////
// @desc    To check valid user
// @access  Private
const isValidUserId = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId });
    return !!user;
  } catch (error) {
    return false;
  }
};

// @desc    Follow user
// @route   POST /user/:userId/follow/:followeeUserId
// @access  Registerd users
export const followHelper = (userId, followeeId) => {
  return new Promise((resolve, reject) => {
    try {
      //Checking userIDs
      if (!isValidUserId(userId) && !isValidUserId(followeeId)) {
        reject(new Error("Invalid user ID"));
        return;
      }

      Connection.findOneAndUpdate(
        { userId: userId },
        { $addToSet: { following: followeeId } },
        { upsert: true, new: true }
      )
        .exec()
        .then((userConnection) => {
          Connection.findOneAndUpdate(
            { userId: followeeId },
            { $addToSet: { followers: userId } },
            { upsert: true, new: true }
          )
            .exec()
            .then((followeeConnection) => {
              console.log(userConnection, followeeConnection);

              resolve({ userConnection, followeeConnection });
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

// @desc    Unfollow user
// @route   POST /user/:userId/unfollow/:followeeUserId
// @access  Registerd users
export const unfollowHelper = (userId, followeeId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Validate user IDs
      if (!isValidUserId(userId) || !isValidUserId(followeeId)) {
        reject(new Error("Invalid user ID"));
        return;
      }

      // Update the user's following list
      const userConnection = await Connection.findOneAndUpdate(
        { userId: userId },
        { $pull: { following: followeeId } },
        { new: true }
      ).exec();

      // Update the followee's followers list
      const followeeConnection = await Connection.findOneAndUpdate(
        { userId: followeeId },
        { $pull: { followers: userId } },
        { new: true }
      ).exec();

      resolve({ userConnection, followeeConnection });
    } catch (error) {
      reject(error);
    }
  });
};

// @desc    Get connections
// @route   GET /user/fetch/connection/:userId
// @access  Registerd users
export const getConnectonHelper = (userId) => {
  return new Promise((resolve, reject) => {
    try {
      Connection.findOne({ userId: userId })
        .then((connection) => {
          resolve(connection);
        })
        .catch((error) =>
          reject({
            status: 500,
            error_code: "DB_FETCH_ERROR",
            message: error.message,
            error,
          })
        );
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: error.message,
        error,
      });
    }
  });
};

////////////////////////////////////////////////// EMAIL VERIFICATION //////////////////////////////////////////////////////////////////
// @desc    Sent verification link
// @route   GET /auth/send-verification
// @access  Public - Registerd users
export const sendEmail = (email) => {
  return new Promise((resolve, reject) => {
    try {
      User.findOne({ email: email })
        .select("-password")
        .exec()
        .then((user) => {
          if (user) {
            verificationEmail(user.email, user.username, user.id)
              .then((response) => {
                resolve({
                  status: 200,
                  message: "verification email has been sent.",
                });
              })
              .catch((error) => {
                reject({
                  status: error.status,
                  message: error.message || "verification email has been sent.",
                  error,
                });
              });
          } else {
            reject({ status: 404, message: "User not found" });
          }
        })
        .catch((error) => {
          reject({
            status: error.status,
            message: error.message || "verification email has been sent.",
            error,
          });
        });
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Somethings wrong please try after sometime.",
      });
    }
  });
};
export const checkToken = async (userId, token) => {
  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return Promise.reject({ status: 404, message: "User not found" });
    }
    if (user.verified) {
      return Promise.reject({ status: 400, message: "User Already verified" });
    }

    const existingToken = await Verify.findOne({
      token: token,
    });

    if (!existingToken) {
      return Promise.reject({
        status: 400,
        message:
          "Token is expired or invalid. Try Sending Another Verification Mail",
      });
    }

    // Update the 'used' key in the Verify schema to true
    existingToken.used = true;
    await existingToken.save();

    // Update the 'verified' key in the User schema to true
    user.verified = true;
    await user.save();

    return Promise.resolve({
      status: 200,
      message: "Token is valid, user verified",
    });
  } catch (error) {
    return Promise.reject({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

/////////////////////////////// password management //////////////////////////////

export const changePasswordRequestHelper = (userId, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.findOne({ _id: userId });

      generateTokenForPassword({
        email: user.email,
        password: hashedPassword,
        username: user.username,
      })
        .then((res) => {
          resolve({
            status: res.status || 200,
            message: erroresr.message || "Success",
            res,
          });
        })
        .catch((err) => {
          reject({
            status: err.status,
            message: err.message || "went wrong",
            err,
          });
        });
    } catch (error) {
      reject(error);
    }
  });
};
