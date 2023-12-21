import { Router } from "express";
const router = Router();

import {
  login,
  register,
  // sendVerifyEmail,
  followUser,
  unfollowUser,
  fetch_Users,
} from "../controllers/userController.js";

router.post("/login", login);

router.post("/register", register);

// EMAIL VERIFICATION
// router.post('/sendverifyemail',sendVerifyEmail);

// @desc    Follow user
// @access  Registerd users
router.post("/:userId/follow/:followeeUserId", followUser);

// @desc    Unfollow user
// @access  Registerd users
router.post("/:userId/unfollow/:followeeUserId", unfollowUser);



// @desc    Fetch users
// @access  Authenticated users
router.get("/fetch-users", fetch_Users);
export default router;
