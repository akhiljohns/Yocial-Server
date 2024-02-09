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
  fetchUserByUsername,
  getConnection,
  updateProfile,
  savePost,
  removeSavedPost,
  fetchSavedPosts,
} from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";

router.post("/login", login);

router.post("/register", register);

// EMAIL VERIFICATION
// router.post('/sendverifyemail',sendVerificationEmail);

// @desc    Follow user
// @access  Registerd users
router.post("/:userId/follow/:followeeUserId", protect, followUser);

// @desc    update user profiel
// @access  Registerd users
router.post("/update/profile", protect, updateProfile);

// @desc    update user profiel
// @access  Registerd users
// router.post("/update/email", protect, updateEmail);

// @desc    Unfollow user
// @access  Registerd users
router.post("/:userId/unfollow/:followeeUserId", protect, unfollowUser);

// @desc    Get connections
// @access  Registerd users
router.get("/fetch/connection/:userId", protect, getConnection);

// @desc    Fetch user by id
// @access  Authenticated users
router.get("/fetch-users", protect, fetch_Users);

// @desc    Fetch user by username
// @access  Authenticated users
router.get("/fetch/username/:username", protect, fetchUserByUsername);

// @desc    Save post
// @access  Registerd users
router.put("/:userId/save/post/:postId", protect, savePost);

// @desc    Fetch Saved post
// @access  Registerd users
router.get("/savedposts/:userId", fetchSavedPosts);

// @desc    Remove saved post
// @access  Registerd users
router.delete("/:userId/save/post/remove/:postId", protect, removeSavedPost);

///////////////////////// password management //////////////////
router.post("/password/verify/email", protect, requestVerification);

export default router;
