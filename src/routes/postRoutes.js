import { Router } from "express";
const router = Router();

import { createPost } from "../controllers/postController.js";

// @desc    Create post
// @access  Authenticated user
router.post("/create-post", createPost);

export default router;
