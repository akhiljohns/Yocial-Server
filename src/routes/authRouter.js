import { Router } from "express";
const router = Router();

import { changePassword } from "../controllers/authController.js";

import {
  sendEmailConfirmation,
  sendVerificationEmail,
  verifyEmail,
  verifyEmailConfirmation,
} from "../controllers/userController.js";
import protect, { refreshAccessToken } from "../middlewares/authMiddleware.js";
import { refreshAdminAccessToken } from "../middlewares/adminAuth.js";

// @desc    Send email verification for registering email
// @access  Registerd users
router.post("/send-verification", sendVerificationEmail);

//@desc Verify email for registration
router.get("/verify/:id/:token", verifyEmail);

// @desc    Send Verify email for changing email
// @access  Registerd users
router.post("/update/email", sendEmailConfirmation);

// @desc    Verify email for changing email
router.post("/change-email/:id/:token", verifyEmailConfirmation);

// @desc    Renew user access token
// @access  Private
router.post('/user/refresh-token', refreshAccessToken);

// @desc    Renew admin access token
// @access  Private- admin
router.post('/admin/refresh-token', refreshAdminAccessToken);



// change password
router.get("/change-password/verify/:username/:token", protect, changePassword);

export default router;
