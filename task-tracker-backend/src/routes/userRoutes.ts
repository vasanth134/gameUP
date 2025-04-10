// src/routes/userRoutes.ts
import express from 'express';
import { getUserXP } from '../controllers/userController';
import { getXPLeaderboard } from '../controllers/userController';
import { getChildSummaryForParent } from '../controllers/userController';
import { getXpSummary } from '../controllers/userController';
import { getAssignedTasksForChild } from '../controllers/userController';
import { getDashboardStats } from '../controllers/userController';
import { parentLogin, childLogin } from '../controllers/authController';


const router = express.Router();

router.get('/:id/xp', getUserXP); // Correctly mapped route
router.get('/leaderboard', getXPLeaderboard); // NEW route
router.get('/parent/:childId/summary', getChildSummaryForParent); // New Parent Summary Route
router.get('/:childId/xp-summary', getXpSummary);
router.get('/:childId/assigned-tasks', getAssignedTasksForChild);
router.get('/:childId/dashboard-summary', getDashboardStats);
router.post('/login/parent', parentLogin);
router.post('/login/child', childLogin);

export default router;
