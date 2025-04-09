// src/routes/userRoutes.ts
import express from 'express';
import { getUserXP } from '../controllers/userController';

const router = express.Router();

router.get('/:id/xp', getUserXP); // Correctly mapped route

export default router;
