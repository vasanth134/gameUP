import express from "express";
const router = express.Router();

// Example: You can import controllers if you separate logic
// import { loginParent, loginChild } from "../controllers/auth.controller";

router.post("/parent", async (req, res) => {
  const { email, password } = req.body;
  // TODO: validate, check DB, return token
  res.status(200).json({ message: "Parent login success", user: { email } });
});

router.post("/child", async (req, res) => {
  const { childId, password } = req.body;
  // TODO: validate, check DB, return token
  res.status(200).json({ message: "Child login success", user: { childId } });
});

export default router;
