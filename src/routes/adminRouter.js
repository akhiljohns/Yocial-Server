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

// @desc    Login admin
// @access  Admins
router.post("/login", adminPostLogin);

// @desc    Fetch all users
// @access  Admins
router.get("/fetch-users", fetchAllUsers);

// @desc    Fetch all posts
// @access  Admins
router.get("/fetch-posts", fetchPostsController);

// @desc    Change block status
// @access  Admins
router.patch('/:userId/change-status', changeStatus);

// @desc    fetch singel post comment count
// @access  Admins
router.get('/fetch-comment-count/:postId', fetchCommentCount);


router.post('/register', adminPostRegister);

export default router;
