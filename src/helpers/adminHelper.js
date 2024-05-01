import generateJwt from "../services/jwt.js"; //importing function to generate JWT Token
import bcrypt from "bcrypt"; //importing bcrypt
const saltRounds = 10; //setting salt rounds

//importing models
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import { Comment } from "../models/commentModel.js";

////////////////////////////////////////////////// ADMIN LOGIN //////////////////////////////////////////////////////////////////
// @desc    Login admin
// @route   POST /admin/login
// @access  Private

export const adminLogin = async (data) => {
  try {
    return new Promise(async (resolve, reject) => {
      const admin = await Admin.findOne({ email: data.email });

      if (admin) {
        // Use bcrypt.compare to compare the passwords
        bcrypt.compare(data.password, admin.password).then((passwordMatch) => {
          if (passwordMatch) {
            // Password is correct, generate JWT
            generateJwt(admin)
              .then((adminTokens) => {
                resolve({
                  status: 200,
                  message: "Admin login successful",
                  adminTokens,
                  admin,
                  valid: true,
                });
              })
              .catch((error) => {
                resolve({
                  status: 500,
                  message: error.message,
                  error_code: "INTERNAL_SERVER_ERROR",
                });
              });
          } else {
            // Password is incorrect
            resolve({ status: 401, message: "Invalid credentials" });
          }
        });
      } else {
        // No admin found with the given email
        resolve({ status: 401, message: "Invalid credentials" });
      }
    });
  } catch (error) {
    reject({ status: error.status, message: error.message });
  }
};

////////////////////////////////////////////////// USER RELATED //////////////////////////////////////////////////////////////////
// @desc    Fetch users (with pagination and filters)
// @route   GET /admin/fetch-users
// @access  Admin - private
export const getUsers = (page, perPage, search) => {
  return new Promise((resolve, reject) => {
    try {
      const regex = search ? new RegExp(search, "i") : /.*/;
      User.find({ name: regex })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .select("-password")
        .exec()
        .then((users) => {
          resolve({
            status: 200,
            message: "Succesfully Fetched Users Details",
            users,
          });
        })
        .catch((err) => {
          reject({
            status: 500,
            message: err.message,
            error_code: "DB_FETCH_ERROR",
            err,
          });
        });
    } catch (error) {
      reject({
        status: 500,
        message: error.message,
        error_code: "INTERNAL_SERVER_ERROR",
        error,
      });
    }
  });
};
// @desc    Fetch all users
// @route   GET /admin/fetch-users
// @access  Admin - private
export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    try {
      User.find()
        .select("-password")
        .exec()
        .then((users) => {
          resolve({
            status: 200,
            message: "Succesfully Fetched Users Details",
            users,
          });
        })
        .catch((err) => {
          reject({
            status: 500,
            message: err.message,
            error_code: "DB_FETCH_ERROR",
            err,
          });
        });
    } catch (error) {
      reject({
        status: 500,
        message: error.message,
        error_code: "INTERNAL_SERVER_ERROR",
        error,
      });
    }
  });
};


//function to update user block status
export const toggelBlockStatus = (userId, status) => {
  return new Promise((resolve, reject) => {
    try {
      User.findOneAndUpdate({ _id: userId }, { blocked: status }, { new: true })
        .select("-password")
        .exec()
        .then((response) => {
          resolve({
            status: 200,
            message: "User block status updated",
            user: response,
          }).catch((err) => {
            resolve({
              status: 500,
              error_code: "DB_UPDATE_ERROR",
              message: err.message,
            });
          });
        })
        .catch((err) => {
          resolve({
            status: 500,
            error_code: "DB_UPDATE_ERROR",
            message: err.message,
          });
        });
    } catch (error) {
      resolve({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }
  });
};

//////////////////////////////////////////////// ADMIN REGISTER //////////////////////////////////////////////////////////////////
export const register = ({ name, email, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (await Admin.findOne({ email: email })) {
        reject({
          status: 409,
          error_code: "USER_ALREADY_REGISTERED",
          message: "Email has already been registered",
        });
      }

      bcrypt
        .hash(password, saltRounds)
        .then((hashedPassword) => {
          const newAdmin = new Admin({
            name: name,
            email: email,
            password: hashedPassword,
          });

          newAdmin
            .save()
            .then((response) => {
              resolve({
                status: 200,
                message: "Account created successfully",
              });
            })
            .catch((error) => {
              reject({
                error_code: "DB_SAVE_ERROR",
                message: "omethings wrong try after sometimes",
                status: 500,
              });
            });
        })
        .catch((error) => {
          reject({
            error_code: "PSW_HASHING_ERROR",
            message: "Somethings wrong try after sometimes",
            status: 500,
          });
        });
    } catch (error) {
      reject({
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Somethings wrong try after sometimes",
        status: 500,
      });
      "Error in registration(userHelper): " + error;
    }
  });
};

// @desc    Fetch no of comments
// @route   GET /admin/fetch-comment-count
// @access  Admin - private
export const fetchCommentCountHelper = async (postId) => {
  try {
    const commentCount = await Comment.countDocuments({ postId });

    return {
      status: 200,
      message: "Succesfully Fetched Comment Count",
      commentCount,
    };
  } catch (error) {
    console.error("Error fetching comment count for post:", error);
    throw error;
  }
};
