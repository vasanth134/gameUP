"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// Specific routes must come before generic parameterized routes
router.get('/leaderboard', userController_1.getXPLeaderboard);
router.get('/parent/:parentId/children', userController_1.getChildrenForParent);
router.get('/parent/:childId/summary', userController_1.getChildSummaryForParent);
router.get('/:id', userController_1.getUserById);
router.get('/:id/xp', userController_1.getUserXP);
router.get('/:childId/xp-summary', userController_1.getXpSummary);
router.get('/:childId/assigned-tasks', userController_1.getAssignedTasksForChild);
router.get('/:childId/dashboard-summary', userController_1.getDashboardStats);
router.post('/login/parent', authController_1.parentLogin);
router.post('/login/child', authController_1.childLogin);
router.post('/signup/parent', authController_1.parentSignup); // 👈 New
router.post('/signup/child', authController_1.childSignup); // 👈 New
exports.default = router; // ✅ direct export
