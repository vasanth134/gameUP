import express from 'express';
import {
  getNotificationsByChild,
  markAsRead,
  createNotification
} from '../controllers/notificationController';

const router = express.Router();

router.get('/:childId', getNotificationsByChild);
router.patch('/:notificationId/read', markAsRead);
router.post('/', createNotification); // <-- New route

export default router;
