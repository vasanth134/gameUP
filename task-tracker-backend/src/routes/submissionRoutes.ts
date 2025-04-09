import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  handleSubmissionUpload,
  getSubmissionsByChild,
  getSubmissionsByTask,
  reviewSubmission,
} from '../controllers/submissionController';

const router = express.Router();

// Setup multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Routes
router.post('/upload', upload.single('file'), handleSubmissionUpload);
router.get('/child/:childId', getSubmissionsByChild);
router.get('/task/:taskId', getSubmissionsByTask);
router.put('/review/:submissionId', reviewSubmission); // <-- NEW REVIEW ROUTE

export default router;