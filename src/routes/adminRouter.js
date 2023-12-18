import {Router} from "express"
const router = Router();

import {
    adminPostLogin,
    // adminPostRegister,

} from "../controllers/adminController.js";


// @desc    Login admin
// @access  Admins
router.post('/login', adminPostLogin);

// router.post('/register', adminPostRegister);

export default router;
