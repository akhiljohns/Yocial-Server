import { Router } from "express";
const router = Router();

import { createPost, updatePost } from "../controllers/postController.js";

// @desc    Create post
// @access  Authenticated user
router.post("/create-post", createPost);

// @desc    Update post
// @access  Authenticated user
router.post("/update-post/:postId", updatePost);


export default router;
