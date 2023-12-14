import { userLogin, registration } from "../../src/helpers/userHelper.js";

import { User } from "../models/userModel.js"; //userModel




////////////////////////////////////////////////// USER LOGIN & REGISTRATION //////////////////////////////////////////////////////////////////

// @desc    Login user
// @route   POST /user/login
// @access  Public

export const login = (req, res) => {
  try {
    const userData = {credential:req.body.credential,password:req.body.password};
    userLogin(userData).then((response) => {
      res.status(200).json(response);
    }).catch((err) => {
      res.status(500).send(err);
    })
}
catch (error) {
  res.status(500).send(error);
}
}

// @desc    Register user
// @route   POST /user/register
// @access  Public

export const validateRegister = (req, res) => {
  try {
    const userData = req.body;
    // console.log(`userData in validateRegister ${userData}`);
    registration(userData).then((response) => {
      res.status(200).json(response);
    }).catch((err) => {
      res.status(500).send(err);
    })
}
catch (error) {
  res.status(500).send(error);
}
}

