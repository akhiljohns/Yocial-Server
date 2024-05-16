import { Router } from "express";
const router = Router();

import {
  createPost,
  fetchUserDetails,
  deletePost,
  fetchSinglePost,
  likeUnlikePost,
  updatePost,
  getPostsCountController,
  fetchAllPosts,
  ctrlFetchUserPosts,
  addComment,
  deleteComment,
  fetchComment,
  fetchReplyComments,
  addReply,
  reportPost,
  saveNotification,
  fetchNotifications,
  changeNotifStatus,
} from "../controllers/postController.js";
import protect from "../middlewares/authMiddleware.js";

// @desc    Create post
// @access  Authenticated user
// router.post("/create-post", protect, createPost);
router.post("/create-post", protect, createPost);

// @desc    Update post
// @access  Authenticated user
router.post("/update-post/:postId", protect, updatePost);

// @desc    Fetch Single post
// @access  Authenticated user
router.get("/fetch-single-post/:postId", protect, fetchSinglePost);

// @desc    Fetch a user's posts
// @access  Registerd users
router.get("/fetchUserPosts", protect, ctrlFetchUserPosts);

// @desc    Fetch posts count
// @access  Private
router.get("/fetch-count", protect, getPostsCountController);

// @desc    Fetch all posts
// @access  Authenticated user
router.get("/fetch-posts", protect, fetchAllPosts);

// @desc    Fetch a user's posts
// @access  Registerd users
router.get("/fetchUserDetails", protect, fetchUserDetails);

// @desc    delete Single post
// @access  Authenticated user
router.delete("/delete/post/:postId", protect, deletePost);

// @desc    like&unlike Post
// @access  Authenticated user
router.patch("/like-unlike/:postId/:userId", protect, likeUnlikePost);

// COMMENTS

// @desc    Add comment
// @access  Registerd users
router.post("/add-comment", protect, addComment);

// @desc    Delete comment
// @access  Registerd users
router.post("/delete-comment", protect, deleteComment);

// @desc    Get comment
// @access  Registerd users
router.get("/fetch-comments/:postId/:type", protect, fetchComment);

// @desc    Get reply comments
// @access  Registerd users
router.get("/comments/replies/:commentId", protect, fetchReplyComments);
// @desc    Reply comment
// @access  Registerd users
router.post("/comments/reply-to/:commentId", protect, addReply);

// @desc    Report user
// @access  Registerd users
router.post("/report/post/:userId/:username", protect, reportPost);

// @desc    Save notification
// @access  Registerd users
router.post("/newnotification", protect, saveNotification);

// @desc    fetch notifications
// @access  Registerd users
router.get("/fetch-notifications/:userId", protect, fetchNotifications);

// @desc    change notification status
// @access  Registerd users
router.get("/notification/status/:notificationId", protect, changeNotifStatus);

export default router;
