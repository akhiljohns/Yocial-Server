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
  getPostReports,
} from "../controllers/adminController.js";
import { fetchAllPosts } from "../controllers/postController.js";
import adminProtect from "../middlewares/adminAuth.js";
import { deletePostReportHelper } from "../helpers/adminHelper.js";

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

// @desc    Fetch post reports
// @access  Admins
router.get("/reports/posts", adminProtect, getPostReports);

// @desc    delete post report
// @access  Admins
router.get("/report/delete/:reportId", adminProtect, deletePostReportHelper);

// router.get("/reports/posts/:perPage/:page", adminProtect, getPostReports);

export default router;
