import jwt from "jsonwebtoken"; //importing jwt from jsonwebtoken

//importing models
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";

// @desc    To renew the access token
// @route   < Middleware - Helper >
// @access  Private
const renewAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId: userId },
      process.env.JWT_KEY_SECRET,
      { expiresIn: "1hr" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

// @desc    To et user from decoded token
// @route   < Middleware - Helper >
// @access  Private
const verifyAdmin = (decodedToken) => {
  return new Promise((resolve, reject) => {
    Admin.findOne({ _id: decodedToken?.userId })
      .select("-password")
      .then((user) => {
        resolve(user);
      })
      .catch((err) => reject(err));
  });
};

// @desc    Admin authentication
// @route   < Middleware >
// @access  Private
const adminProtect = async (req, res, next) => {
  let adminToken;
  if (req.headers.authorization) {
    try {
      adminToken = req.headers.authorization;
      const decoded = jwt.verify(adminToken, process.env.JWT_KEY_SECRET);

      User.findOne({ _id: decoded.userId })
        .select("-password")
        .then((admin) => {
          if (admin && admin.role === 'admin') {
            req.admin = admin;
            next();
          } else {
            // Admin not found
            res.status(404).json({
              message: "Admin not found",
              status: 404,
              error_code: "NOT_FOUND",
            });
          }
        })
        .catch((err) => {
          // Handle database errors
          console.error(error);
          res.status(500).json({
            message: "Internal Server Error",
            status: 500,
            error_code: "INTERNAL_SERVER_ERROR",
          });
        });
    } catch (error) {
      // Token verification failed
      console.error(error);
      res.status(401).json({
        message: "User not authorized",
        status: 401,
        error_code: "AUTHENTICATION_FAILED",
      });
    }
  } else {
    // No token provided
    res.status(401).json({
      status: 401,
      message: "No token provided",
      error_code: "NO_TOKEN",
    });
  }
};

export default adminProtect;

export const refreshAdminAccessToken = (req, res) => {
  try {
    if (req.headers.authorization) {
      const refreshToken = req.headers.authorization;

      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      ); // decoding the refresh token

      verifyAdmin(decodedRefreshToken)
        .then(async (user) => {
          if (user) {
            const newAccessToken = await renewAccessToken(
              decodedRefreshToken?.userId
            );
            res.status(200).send({ newToken: newAccessToken });
          } else {
            // User not found
            res.status(401).json({
              message: "User not authorized",
              status: 401,
              error_code: "AUTHENTICATION_FAILED",
            });
          }
        })
        .catch((error) => {
          res.status(401).json({
            message: "User not authorized",
            status: 401,
            error_code: "AUTHENTICATION_FAILED",
            error,
          });
        });
    } else {
      // No token provided
      res.status(401).json({
        status: 401,
        message: "No token provided",
        error_code: "NO_TOKEN",
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "User not authorized",
      status: 401,
      error_code: "AUTHENTICATION_FAILED",
      error,
    });
  }
};
