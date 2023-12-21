import { Router } from "express";
const router = Router();


import { sendVerificationEmail } from "../controllers/userController.js";


// @desc    Sent email verification
// @access  Registerd users
router.post("/send-verification", sendVerificationEmail);

// router.get("/verify/:id/:token", verifyEmail);

export default router;
    