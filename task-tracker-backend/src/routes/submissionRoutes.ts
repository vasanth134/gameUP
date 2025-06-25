import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  handleSubmissionUpload,
  createSimpleSubmission,
  getSubmissionsByChild,
  getSubmissionsByTask,
  reviewSubmission,
  getSubmissionStatusByChild,
  isTaskSubmittedByChild,
  getChildSubmissionSummary,
  getPendingSubmissions,
  getAllSubmissionsForParent,
} from '../controllers/submissionController';
// import submissionRoutes from '../routes/submissionRoutes';

const router = express.Router();

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Routes

// Simple submission without file
router.post('/', createSimpleSubmission);

// Upload submission with file
router.post('/upload', upload.single('photo'), handleSubmissionUpload);

// Get all submissions by child
router.get('/child/:childId/submissions', getSubmissionsByChild);

// Get status summary for dashboard (approved, rejected, pending, XP, etc.)
router.get('/child/:childId/status-summary', getSubmissionStatusByChild);

// Get all submissions by task
router.get('/task/:taskId', getSubmissionsByTask);

// Review a submission (approve/reject + optional XP update)
router.put('/:submissionId/review', reviewSubmission);

router.get('/check/:taskId/:childId', isTaskSubmittedByChild);

router.get('/child/:childId/summary', getChildSubmissionSummary);

// Parent routes for reviewing submissions
router.get('/parent/:parentId/pending', getPendingSubmissions);
router.get('/parent/:parentId/all', getAllSubmissionsForParent);

export default router;
