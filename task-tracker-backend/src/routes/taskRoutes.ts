// src/routes/task.routes.ts
import express from 'express';
import { createTask } from '../controllers/taskController';
import { getTasksByChild } from '../controllers/taskController';

const router = express.Router();

router.post('/', createTask); // POST /api/tasks/create
router.get('/child/:childId', getTasksByChild);

export default router;
