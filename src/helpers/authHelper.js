import User from "../models/userModel.js"; //userModel

import { Verify } from "../models/verifyModel.js";

export const changePasswordHelper = (token, username) => {
  return new Promise((resolve, reject) => {
    try {
      Verify.findOneAndUpdate(
        { username: username, token: token, used: false },
        { used: true }
      )
        .then((res) => {
          if (res) {
            User.findOneAndUpdate(
              { username: username },
              { password: res.password }
            )
              .then(async (response) => {
                resolve({
                  status: 200,
                  message:
                    "password has been changed successfully, Please go back to home page.",
                  response,
                });
              })
              .catch((err) => {
                reject({
                  status: err.status || 500,
                  message: err.message || "Something Went wrong",
                  err,
                });
              });
          }
        })
        .catch((err) => {
          reject({
            status: err.status || 500,
            message: err.message || "Something Went wrong",
            err,
          });
        });
    } catch (err) {
      reject({
        status: err.status || 500,
        message: err.message || "Something Went wrong",
        err,
      });
    }
  });
};
