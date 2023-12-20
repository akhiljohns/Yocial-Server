import { Router } from "express";
const router = Router();

import {
  adminPostLogin,
  // adminPostRegister,
  fetchUsers,
} from "../controllers/adminController.js";

// @desc    Login admin
// @access  Admins
router.post("/login", adminPostLogin);

// @desc    Fetch all users
// @access  Admins
router.get("/fetch-users", fetchUsers);

// router.post('/register', adminPostRegister);

export default router;
