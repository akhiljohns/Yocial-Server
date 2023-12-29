import { Router } from "express";
const router = Router();

import {
  login,
  register,
  // sendVerificationEmail,
  followUser,
  unfollowUser,
  fetch_Users,
  requestVerification,
} from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";

router.post("/login", login);

router.post("/register", register);

// EMAIL VERIFICATION
// router.post('/sendverifyemail',sendVerificationEmail);

// @desc    Follow user
// @access  Registerd users
router.post("/:userId/follow/:followeeUserId", protect, followUser);

// @desc    Unfollow user
// @access  Registerd users
router.post("/:userId/unfollow/:followeeUserId", protect, unfollowUser);

// @desc    Fetch users
// @access  Authenticated users
router.get("/fetch-users", protect, fetch_Users);

///////////////////////// password management //////////////////
router.post("/password/verify/email", protect, requestVerification);

export default router;
