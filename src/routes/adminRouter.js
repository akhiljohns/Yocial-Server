import { Router } from "express";
const router = Router();

import {
  adminPostLogin,
  adminPostRegister,
  fetchUsers,
  changeStatus,
  fetchAllUsers,
  fetchCommentCount,
  fetchPostsController,
} from "../controllers/adminController.js";
import { fetchAllPosts } from "../controllers/postController.js";
import adminProtect from "../middlewares/adminAuth.js";

// @desc    Login admin
// @access  Admins
router.post("/login", adminPostLogin);

// @desc    Fetch all users
// @access  Admins
router.get("/fetch-users", adminProtect, fetchAllUsers);

// @desc    Fetch all posts
// @access  Admins
router.get("/fetch-posts", adminProtect, fetchPostsController);

// @desc    Change block status
// @access  Admins
router.patch("/:userId/change-status", adminProtect, changeStatus);

// @desc    fetch singel post comment count
// @access  Admins
router.get("/fetch-comment-count/:postId", adminProtect, fetchCommentCount);

router.post("/register", adminPostRegister);

export default router;
