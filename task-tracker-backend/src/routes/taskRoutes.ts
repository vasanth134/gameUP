// src/routes/task.routes.ts
import express from 'express';
import { createTask } from '../controllers/taskController';

const router = express.Router();

router.post('/create', createTask); // POST /api/tasks/create

export default router;
