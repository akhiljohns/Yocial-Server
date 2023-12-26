import { Router } from "express";
const router = Router();

import {
  createPost,
  fetchSinglePost,
  updatePost,
} from "../controllers/postController.js";

// @desc    Create post
// @access  Authenticated user
router.post("/create-post", createPost);

// @desc    Update post
// @access  Authenticated user
router.put("/update-post/:postId", updatePost);

// @desc    Fetch Single post
// @access  Authenticated user
router.get("/fetch-single-post/:postId", fetchSinglePost);

export default router;
