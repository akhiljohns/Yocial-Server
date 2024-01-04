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
import { findQuery } from "../services/query.js";

////////////////////////////////////////////////// USER LOGIN & REGISTRATION //////////////////////////////////////////////////////////////////
// @desc    Login user
// @route   POST /users/login
// @access  Public
export const userLogin = async ({ credential, password }) => {
  try {
    const queryRes = await findQuery(credential);

    if (queryRes.error) {
      throw { status: queryRes.error.status, message: queryRes.error.message };
    }

    let query = queryRes;

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
      throw {
        status: 403,
        message: "Wrong Password",
        error_code: "Unauthorized",
      };
    }

    if (!user.verified) {
      throw {
        status: 403,
        message: "Kindly Verify Your Email Before Proceeding",
        error_code: "Unauthorized",
        userVerified: false,
      };
    }

    if (user.blocked) {
      throw {
        status: 403,
        message: "Your Account Is Temporarily Blocked",
        error_code: "FORBIDDEN_LOGIN",

      };
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
      userVerified: error.userVerified,
    };
  }
};

// @desc    Register user
// @route   POST /users/register
// @access  Public
export const registration = async ({
  fName,
  lName,
  username,
  email,
  password,
  phone,
}) => {
  try {
    // Check if username exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return {
        status: 409,
        error_code: "USERNAME_TAKEN",
        message: "Username already in use",
      };
    }

    // Check if email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
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
      name: fName + " " + lName,
      phone: phone ? phone : null,
    });


    // Save the user to the database
    await newUser.save();

    const emailResp = await sendEmail(newUser.email);
    return {
      status: emailResp.status || 200,
      message: emailResp.message || "Account Created Successfully",
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

// @desc    Search user by username
// @route   GET /user/fetch/user/username/:username
// @access  Registerd users
export const userByUsernameHelper = (username) => {
  return new Promise((resolve, reject) => {
    try {
      User.findOne({ username: username })
        .select("-password")
        .exec()
        .then((user) => {
          resolve(user);
        })
        .catch((err) => {
          resolve({
            status: 500,
            error_code: "DB_FETCH_ERROR",
            message: err.message,
          });
        });
    } catch (error) {
      resolve({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: err.message,
      });
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
// @access  Registered users
export const getConnectonHelper = async (userId) => {
  try {
    const response = await Connection.findOne({ userId: userId });

    let connection = {};
    if (!response) {
      connection = { followersCount: 0, followingCount: 0 };
    } else {
      connection = {
        followersCount: response.followers,
        followingCount: response.following,
      };
    }

    return {
      status: 200,
      message: "User Connection Fetched",
      connection,
    };
  } catch (error) {
    throw {
      status: error.status || 500,
      error_code: error?.error_code || "DB_FETCH_ERROR",
      message: error.message,
      error,
    };
  }
};


////////////////////////////////////////////////// EMAIL VERIFICATION //////////////////////////////////////////////////////////////////
// @desc    Sent verification link
// @route   GET /auth/send-verification
// @access  Public - Registerd users
export const sendEmail = (credential) => {
  return new Promise(async (resolve, reject) => {
    try {
      const queryRes = await findQuery(credential);

      if (queryRes.error) {
        throw {
          status: queryRes.error.status,
          message: queryRes.error.message,
        };
      }

      let query = queryRes;

      User.findOne(query)
        .select("-password")
        .exec()
        .then((user) => {
          if (user) {
            verificationEmail(user.email, user.username, user.id)
              .then((response) => {
                resolve({
                  status: 200,
                  message:
                    "A Verification email has been sent to the registered Email Address,kindly verify the email before proceeding",
                });
              })
              .catch((error) => {
                reject({
                  status: error.status,
                  message:
                    error.message || "Something went wrong,try again later",
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
            message: error.message || "Something went wrong,try again later",
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
