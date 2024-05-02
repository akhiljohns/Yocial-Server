import { Router } from "express";
const router = Router();

import {
  adminPostLogin,
  adminPostRegister,
  fetchUsers,
  changeStatus,
  fetchAllUsers,
  fetchCommentCount,
  fetchAllPosts
} from "../controllers/adminController.js";

// @desc    Login admin
// @access  Admins
router.post("/login", adminPostLogin);

// @desc    Fetch all users
// @access  Admins
router.get("/fetch-users", fetchAllUsers);

// @desc    Change block status
// @access  Admins
router.patch('/:userId/change-status', changeStatus);
// @desc    fetch single posts comment count 
// @access  Admins
router.get('/fetch-comment-count/:postId', fetchCommentCount);

// @desc    Fetch all posts
// @access  Admins
router.get("/fetch-posts", fetchAllPosts);


router.post('/register', adminPostRegister);

export default router;
