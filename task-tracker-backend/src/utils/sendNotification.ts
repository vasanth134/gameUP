// ✅ src/utils/sendNotification.ts
import { pool } from '../config/db';

export const sendNotification = async (childId: number, message: string) => {
  try {
    await pool.query(
      'INSERT INTO notifications (child_id, message) VALUES ($1, $2)',
      [childId, message]
    );
  } catch (err) {
    console.error('Error sending notification:', err);
  }
};
