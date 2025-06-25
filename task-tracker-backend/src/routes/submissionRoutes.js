"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const submissionController_1 = require("../controllers/submissionController");
// import submissionRoutes from '../routes/submissionRoutes';
const router = express_1.default.Router();
// Setup multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: 'uploads/',
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
// Routes
// Simple submission without file
router.post('/', submissionController_1.createSimpleSubmission);
// Upload submission with file
router.post('/upload', upload.single('photo'), submissionController_1.handleSubmissionUpload);
// Get all submissions by child
router.get('/child/:childId/submissions', submissionController_1.getSubmissionsByChild);
// Get status summary for dashboard (approved, rejected, pending, XP, etc.)
router.get('/child/:childId/status-summary', submissionController_1.getSubmissionStatusByChild);
// Get all submissions by task
router.get('/task/:taskId', submissionController_1.getSubmissionsByTask);
// Review a submission (approve/reject + optional XP update)
router.put('/:submissionId/review', submissionController_1.reviewSubmission);
router.get('/check/:taskId/:childId', submissionController_1.isTaskSubmittedByChild);
router.get('/child/:childId/summary', submissionController_1.getChildSubmissionSummary);
// Parent routes for reviewing submissions
router.get('/parent/:parentId/pending', submissionController_1.getPendingSubmissions);
router.get('/parent/:parentId/all', submissionController_1.getAllSubmissionsForParent);
exports.default = router;
