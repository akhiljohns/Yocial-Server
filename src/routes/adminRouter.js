import { Router } from "express";
const router = Router();

import {
  adminPostLogin,
  adminPostRegister,
  fetchUsers,
  changeStatus,
  fetchAllUsers,
  fetchCommentCount,
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
router.get("/fetch-posts", fetchAllPosts);

// @desc    Change block status
// @access  Admins
router.patch('/:userId/change-status', changeStatus);




router.post('/register', adminPostRegister);

export default router;
