import generateJwt from "../services/jwt.js"; //importing function to generate JWT Token
import bcrypt from "bcrypt"; //importing bcrypt
const saltRounds = 10; //setting salt rounds

//importing models
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";

////////////////////////////////////////////////// ADMIN LOGIN //////////////////////////////////////////////////////////////////
// @desc    Login admin
// @route   POST /admin/login
// @access  Private
export const adminLogin = async (data) => {
  try {
    return new Promise(async (resolve, reject) => {
      const admin = await Admin.findOne({ email: data.email });
      if (admin && bcrypt.compare(data.password, admin.password)) {
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
            console.log(error);
            resolve({
              status: 500,
              message: error.message,
              error_code: "INTERNAL_SERVER_ERROR",
            });
          });
      } else {
        resolve({ status: 401, message: "Invalid credentials" });
      }
    });
  } catch (error) {
    console.log("error during admin login (in adminHelper): " + error);
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
          resolve(users);
        })
        .catch((err) => {
          console.log("error fetching users", err);
          reject({
            status: 500,
            message: err.message,
            error_code: "DB_FETCH_ERROR",
            err,
          });
        });
    } catch (error) {
      console.log("error getting users: " + error);
      reject({
        status: 500,
        message: error.message,
        error_code: "INTERNAL_SERVER_ERROR",
        error,
      });
    }
  });
};

////////////////////////////////////////////////// ADMIN REGISTER //////////////////////////////////////////////////////////////////
//   export const register = ({ name, email, password }) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         if (await Admin.findOne({ email: email })) {
//           reject({
//             status: 409,
//             error_code: "USER_ALREADY_REGISTERED",
//             message: "Email has already been registered",
//           });
//         }

//         bcrypt
//           .hash(password, saltRounds)
//           .then((hashedPassword) => {
//             const newAdmin = new Admin({
//               name: name,
//               email: email,
//               password: hashedPassword,
//             });

//             newAdmin
//               .save()
//               .then((response) => {
//                 resolve({
//                   status: 200,
//                   message: "Account created successfully",
//                 });
//               })
//               .catch((error) => {
//                 reject({
//                   error_code: "DB_SAVE_ERROR",
//                   message: "omethings wrong try after sometimes",
//                   status: 500,
//                 });
//               });
//           })
//           .catch((error) => {
//             reject({
//               error_code: "PSW_HASHING_ERROR",
//               message: "Somethings wrong try after sometimes",
//               status: 500,
//             });
//           });
//       } catch (error) {
//         reject({
//           error_code: "INTERNAL_SERVER_ERROR",
//           message: "Somethings wrong try after sometimes",
//           status: 500,
//         });
//         console.log("Error in registration(userHelper): " + error);
//       }
//     });
//   };
