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
  fetchUserByKeyword,
  updateAvatar,
  getMutualFriends,
  blockUser,
  unblockUser,
  getBlockedUsers,
} from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";

router.post("/login", login);

router.post("/register", register);

// EMAIL VERIFICATION
// router.post('/sendverifyemail',sendVerificationEmail);

// @desc    update user profiel
// @access  Registerd users
router.post("/update/profile", protect, updateProfile);

// @desc    update user avatar
// @access  Registerd users
router.post("/update/avatar", protect, updateAvatar);

// @desc    update user profiel
// @access  Registerd users
// router.post("/update/email", protect, updateEmail);

// @desc    Follow user
// @access  Registerd users
router.post("/:userId/follow/:followeeUserId",protect, followUser);

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

// @desc    Fetch users by keyword
// @access  Authenticated users
router.get("/fetch/users/:key", protect, fetchUserByKeyword);

// @desc    Save post
// @access  Registerd users
router.put("/:userId/save/post/:postId", protect, savePost);

// @desc    Fetch Saved post
// @access  Registerd users
router.get("/savedposts/:userId", protect, fetchSavedPosts);

// @desc    Remove saved post
// @access  Registerd users
router.delete("/:userId/save/post/remove/:postId", protect, removeSavedPost);

// @desc    get mutual friends
// @access  Registerd users
router.get("/getmutuals/:userId", protect, getMutualFriends);

///////////////////////// password management //////////////////
router.post("/password/verify/email", protect, requestVerification);

///////////////////////// USER BLOCK SECTION //////////////////
// @desc    block user
// @access  Registerd users
router.get("/:userId/block/:blockUserId", protect, blockUser);

// @desc    unblock user
// @access  Registerd users
router.get("/:userId/unblock/:unBlockUserId", protect, unblockUser);

// @desc    get blocked users
// @access  Registerd users
router.get("/getblockedusers/:userId", protect, getBlockedUsers);

export default router;
