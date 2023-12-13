import bcrypt, { hash } from "bcrypt"; //imporing bcrypt
const saltRounds = 10; //setting salt rounds

import { User } from "../models/userModel.js"; //userModel

export const userLogin = (userData) => {
  try {
    let loginStatus = false;
    let response = {};
    return new Promise((resolve, reject) => {
      User.findOne({ email: userData.email }).then(async (foundUser) => {
        // console.log(foundUser + "----------------------");
        if (foundUser) {
          let status = await bcrypt.compare(
            userData.password,
            foundUser.password
          );
          // console.log(status + "_______________");
          if (status) {
            // console.log("logined Successfully");
            response.user = foundUser;
            response.status = true;
          } else {
            console.log("login failed");
            response.status = "Login Failed";
          }
        } else {
          console.log("login failed");
          response.status = "Login Failed";
        }

        resolve(response);
      });
    });
  } catch (error) {
    throw error;
  }
};


export const registration = async ({ name, username, email, password }) => {
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
      name,
    });

    console.log(newUser);

    // Save the user to the database
    await newUser.save();

    return {
      status: 200,
      message: "Account created successfully",
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