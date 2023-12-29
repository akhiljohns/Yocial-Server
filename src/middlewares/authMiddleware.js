import jwt from "jsonwebtoken"; //importing jwt from jsonwebtoken

//importing models
import User from "../models/userModel.js"; //userModel


// @desc    To et user from decoded token
// @route   < Middleware - Helper >
// @access  Private
const verifyUser = (decodedToken) => {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: decodedToken?.userId })
      .select("-password")
      .then((user) => {
        resolve(user);
      })
      .catch((err) => reject(err));
  });
};

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

// @desc    User authentication
// @route   < Middleware >
// @access  Private
const protect = async (req, res, next) => {
  // WHEN WE HAVE AN ACCESS TOKEN
  if (req.headers.authorization) {
    try {
      const accessToken = req.headers.authorization;
      const decoded = jwt.verify(accessToken, process.env.JWT_KEY_SECRET);
      verifyUser(decoded)
        .then((user) => {
          if (user) {
            if (user.verified) {
              if (!user.blocked) {
                req.user = user;
                next();
              } else {
                // User has been blocked
                res.status(403).json({
                  message: "User has been blocked",
                  status: 403,
                  error_code: "FORBIDDEN",
                });
              }
            } else {
                // User Email Not Verified
              res.status(401).json({
                message: "User Not Verified",
                status: 401,
                error_code: "Unauthorized",
              });
            }
          } else {
            // User not found
            res.status(404).json({
              message: "User not found",
              status: 404,
              error_code: "NOT_FOUND",
            });
          }
        })
        .catch((error) => {
          // Handle database errors
          console.log(error);
          res.status(500).json({
            message: "Internal Server Error",
            status: 500,
            error_code: "INTERNAL_SERVER_ERROR",
            error,
          });
        });
    } catch (e) {
      console.log(e);
      // Token verification failed
      res.status(401).json({
        message: "User not authorized",
        status: 401,
        error_code: "AUTHENTICATION_FAILED",
      });
    }

    // WHEN WE HAVE NO ACCESS BUT REFRESH TOKEN
  } else {
    // No token provided
    res.status(401).json({
      status: 401,
      message: "No token provided",
      error_code: "NO_TOKEN",
      noRefresh: true,
    });
  }
};


export default protect;

export const refreshAccessToken = (req, res) => {
  try {
    if (req.headers.authorization) {
      const refreshToken = req.headers.authorization;

      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      ); // decoding the refresh token

      verifyUser(decodedRefreshToken)
        .then(async (user) => {
          if (user && !user?.blocked) {
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
