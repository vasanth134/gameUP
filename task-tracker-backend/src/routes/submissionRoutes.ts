import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  handleSubmissionUpload,
  getSubmissionsByChild,
  getSubmissionsByTask,
  reviewSubmission,
  getSubmissionStatusByChild,
  isTaskSubmittedByChild,
  getChildSubmissionSummary, // ✅ all good here
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

// Upload submission
router.post('/upload', upload.single('file'), handleSubmissionUpload);

// Get all submissions by child
router.get('/child/:childId/submissions', getSubmissionsByChild);

// Get status summary for dashboard (approved, rejected, pending, XP, etc.)
router.get('/child/:childId/status-summary', getSubmissionStatusByChild);

// Get all submissions by task
router.get('/task/:taskId', getSubmissionsByTask);

// Review a submission (approve/reject + optional XP update)
router.put('/review/:submissionId', reviewSubmission); // ✅ CORRECT

router.get('/check/:taskId/:childId', isTaskSubmittedByChild);

router.get('/child/:childId/summary', getChildSubmissionSummary);

export default router;
