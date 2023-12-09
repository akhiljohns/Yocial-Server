import { userLogin, registration } from "../../src/helpers/userHelper.js";

import { User } from "../models/userModel.js"; //userModel

export const login = (req, res, next) => {
  try {
    const userData = req.body;
    userLogin(userData)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const validateRegister = (req, res, next) => {
  return new Promise(function (resolve, reject) {
    console.log(req.body, "req.body");
    if (Object.keys(req.body).length === 0) {
      res.status(200).json("user empty");
      return;
    }
    const email = req.body.email;
    const phone = req.body.phoneNumber;
    User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } }).then(
      (response) => {
        if (response) {
          const emailExists = "email already exists";
          resolve({ emailExists });
        } else {
          User.findOne({ number: phone }).then((response) => {
            if (response) {
              const phoneExists = "phone already exists";
              resolve({ phoneExists });
            } else {
              const regStatus = register(req.body);
              res.status(200).json("userregistered");
            }
          });
        }
      }
    );
  });
};

export const register = (userData) => {
  try {
    registration(userData)
      .then((response) => {
        return true;
      })
      .catch((err) => {
        return false;
      });
  } catch (error) {
    return false;
  }
};
