import express from "express";
import { parentLogin, childLogin, parentSignup, childSignup } from "../controllers/authController";

const router = express.Router();

// Login routes
router.post("/login/parent", parentLogin);
router.post("/login/child", childLogin);

// Signup routes
router.post("/signup/parent", parentSignup);
router.post("/signup/child", childSignup);

export default router;
