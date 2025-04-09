import express from 'express';
import { getNotificationsByChild, markAsRead } from '../controllers/notificationController';

const router = express.Router();

router.get('/:childId', getNotificationsByChild);
router.patch('/:notificationId/read', markAsRead);

export default router;
