import express from "express";
import { createUserInfo } from "../controllers/userInfoController.js";

const router = express.Router();
 
router.post("/post/userInfo", createUserInfo);
export default router;
