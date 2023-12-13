import { Router } from "express";
const router = Router();
    

import {
    login,
    validateRegister
} from "../controllers/userController.js";

router.post('/login', login);

router.post('/register', validateRegister);

export default router