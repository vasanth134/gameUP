// src/routes/task.routes.ts
import express from 'express';
import { createTask, getTasks, getTasksByChild } from '../controllers/taskController';

const router = express.Router();

router.get('/', getTasks); // GET /api/tasks?userId=123&role=parent|child
router.post('/', createTask); // POST /api/tasks/create
router.get('/child/:childId', getTasksByChild);

export default router;
