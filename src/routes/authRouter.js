import { Router } from "express";
const router = Router();

import { changePassword } from "../controllers/authController.js";

import {
  sendVerificationEmail,
  verifyEmail,
} from "../controllers/userController.js";
import protect, { refreshAccessToken } from "../middlewares/authMiddleware.js";
import { refreshAdminAccessToken } from "../middlewares/adminAuth.js";

// @desc    Sent email verification
// @access  Registerd users
router.post("/send-verification", sendVerificationEmail);

router.get("/verify/:id/:token", verifyEmail);

// @desc    Renew user access token
// @access  Private
router.post('/user/refresh-token', refreshAccessToken);

// @desc    Renew admin access token
// @access  Private- admin
router.post('/admin/refresh-token', refreshAdminAccessToken);



// change password
router.get("/change-password/verify/:username/:token", protect, changePassword);

export default router;
