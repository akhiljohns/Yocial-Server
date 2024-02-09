import { Router } from "express";
const router = Router();

import {
  adminPostLogin,
  adminPostRegister,
  fetchUsers,
  changeStatus,
  fetchAllUsers,
} from "../controllers/adminController.js";

// @desc    Login admin
// @access  Admins
router.post("/login", adminPostLogin);

// @desc    Fetch all users
// @access  Admins
router.get("/fetch-users", fetchAllUsers);

// @desc    Change block status
// @access  Admins
router.patch("/:userId/change-status", changeStatus);

router.post("/register", adminPostRegister);

export default router;
