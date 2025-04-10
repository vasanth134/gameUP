import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getNotificationsByChild = async (req: Request, res: Response) => {
  const { childId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM notifications WHERE child_id = $1 ORDER BY created_at DESC',
      [childId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  const { notificationId } = req.params;

  try {
    await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1',
      [notificationId]
    );
    res.status(200).json({ message: 'Marked as read' });
  } catch (err) {
    console.error('Error updating notification:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// src/controllers/notificationController.ts
export const createNotification = async (req: Request, res: Response) => {
  const { childId, message } = req.body;

  try {
    await pool.query(
      `INSERT INTO notifications (child_id, message)
       VALUES ($1, $2)`,
      [childId, message]
    );
    res.status(201).json({ message: 'Notification sent' });
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
  
