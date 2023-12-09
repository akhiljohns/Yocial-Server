import { Router } from "express";
const router = Router();
    

import {
    login,
    register,
    validateRegister
} from "../controllers/userController.js";

router.get('/login', login);

router.get('/register', validateRegister);

export default router 