import bcrypt, { hash } from "bcrypt"; //imporing bcrypt
const saltRounds = 10; //setting salt rounds
import generateJwt from "../services/jwt.js"; //imporing jwt

// importing models
import User from "../models/userModel.js"; //userModel

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
  name,
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
      name,
      phone: phone ? phone : null,
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
