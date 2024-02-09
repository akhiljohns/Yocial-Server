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
export default router;
