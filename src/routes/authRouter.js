import { Router } from "express";
const router = Router();

import { changePassword } from "../controllers/authController.js";


import { sendVerificationEmail,verifyEmail } from "../controllers/userController.js";


// @desc    Sent email verification
// @access  Registerd users
router.post("/send-verification", sendVerificationEmail);

router.get("/verify/:id/:token", verifyEmail);


// change password
router.get('/change-password/verify/:username/:token', changePassword);




export default router;
    