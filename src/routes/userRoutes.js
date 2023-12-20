import { Router } from "express";
const router = Router();

import {
  login,
  register,
  // sendVerifyEmail,
} from "../controllers/userController.js";

router.post("/login", login);

router.post("/register", register);

// EMAIL VERIFICATION
// router.post('/sendverifyemail',sendVerifyEmail);

export default router;
