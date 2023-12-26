import { Router } from "express";
const router = Router();

import {
  createPost,
  deletePost,
  fetchSinglePost,
  likeUnlikePost,
  updatePost,
} from "../controllers/postController.js";
import protect from "../middlewares/authMiddleware.js";

// @desc    Create post
// @access  Authenticated user
router.post("/create-post", protect, createPost);

// @desc    Update post
// @access  Authenticated user
router.put("/update-post/:postId", protect, updatePost);

// @desc    Fetch Single post
// @access  Authenticated user
router.get("/fetch-single-post/:postId", protect, fetchSinglePost);

// @desc    Fetch Single post
// @access  Authenticated user
router.delete("/delete/post/:postId", protect, deletePost);

// @desc    like&unlike Post
// @access  Authenticated user
router.get("/like-unlike/:postId/:userId", protect, likeUnlikePost);
export default router;
