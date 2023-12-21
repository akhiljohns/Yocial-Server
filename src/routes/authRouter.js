import { Router } from "express";
const router = Router();


import { sendVerificationEmail,verifyEmail } from "../controllers/userController.js";


// @desc    Sent email verification
// @access  Registerd users
router.post("/send-verification", sendVerificationEmail);

router.get("/verify/:id/:token", verifyEmail);

export default router;
    