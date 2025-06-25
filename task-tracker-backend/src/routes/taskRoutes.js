"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/task.routes.ts
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const router = express_1.default.Router();
router.get('/', taskController_1.getTasks); // GET /api/tasks?userId=123&role=parent|child
router.post('/', taskController_1.createTask); // POST /api/tasks/create
router.get('/child/:childId', taskController_1.getTasksByChild);
router.put('/:taskId/status', taskController_1.updateTaskStatus); // PUT /api/tasks/:taskId/status
exports.default = router;
