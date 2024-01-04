// userModel.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Verify user from decoded token
const verifyUser = (decodedToken) => {
  return User.findOne({ _id: decodedToken?.userId }).select("-password");
};

// Renew the access token
const renewAccessToken = async (userId) => {
  return await jwt.sign({ userId: userId }, process.env.JWT_KEY_SECRET, { expiresIn: "1hr" });
};

// Middleware for user authentication
const protect = async (req, res, next) => {
  // Check for access token
  if (req.headers.authorization) {
    try {
      const accessToken = req.headers.authorization;
      const decoded = jwt.verify(accessToken, process.env.JWT_KEY_SECRET);
      const user = await verifyUser(decoded);

      if (user) {
        if (user.verified) {
          if (!user.blocked) {
            req.user = user;
            next(); // Proceed to the next middleware
          } else {
            res.status(403).json({ message: "User has been blocked", status: 403, error_code: "FORBIDDEN" });
          }
        } else {
          res.status(401).json({ message: "User Not Verified", status: 401, error_code: "Unauthorized" });
        }
      } else {
        res.status(404).json({ message: "User not found", status: 404, error_code: "NOT_FOUND" });
      }
    } catch (e) {
      res.status(401).json({ message: "User not authorized", status: 401, error_code: "AUTHENTICATION_FAILED" });
    }
  } else {
    res.status(401).json({ status: 401, message: "No token provided", error_code: "NO_TOKEN", noRefresh: true });
  }
};

// Refresh access token
export  const refreshAccessToken = async (req, res) => {
  try {
    if (req.headers.authorization) {
      const refreshToken = req.headers.authorization;
      const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await verifyUser(decodedRefreshToken);

      if (user && !user?.blocked) {
        const newAccessToken = await renewAccessToken(decodedRefreshToken?.userId);
        res.status(200).send({ newToken: newAccessToken });
      } else {
        res.status(401).json({ message: "User not authorized", status: 401, error_code: "AUTHENTICATION_FAILED" });
      }
    } else {
      res.status(401).json({ status: 401, message: "No token provided", error_code: "NO_TOKEN" });
    }
  } catch (error) {
    res.status(401).json({ message: "User not authorized", status: 401, error_code: "AUTHENTICATION_FAILED", error });
  }
};

export default  protect
