import express from 'express';
import {
  getUserById,
  getUserXP,
  getXPLeaderboard,
  getChildSummaryForParent,
  getXpSummary,
  getAssignedTasksForChild,
  getDashboardStats,
  getChildrenForParent
} from '../controllers/userController';

import { parentLogin, childLogin   ,parentSignup,
    childSignup,} from '../controllers/authController';

const router = express.Router();

// Specific routes must come before generic parameterized routes
router.get('/leaderboard', getXPLeaderboard);
router.get('/parent/:parentId/children', getChildrenForParent);
router.get('/parent/:childId/summary', getChildSummaryForParent);
router.get('/:id', getUserById);
router.get('/:id/xp', getUserXP);
router.get('/:childId/xp-summary', getXpSummary);
router.get('/:childId/assigned-tasks', getAssignedTasksForChild);
router.get('/:childId/dashboard-summary', getDashboardStats);
router.post('/login/parent', parentLogin);
router.post('/login/child', childLogin);
router.post('/signup/parent', parentSignup); // 👈 New
router.post('/signup/child', childSignup);   // 👈 New

export default router; // ✅ direct export
