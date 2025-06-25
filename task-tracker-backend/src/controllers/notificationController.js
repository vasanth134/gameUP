"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = exports.markAsRead = exports.getNotificationsByChild = void 0;
const db_1 = require("../config/db");
const getNotificationsByChild = async (req, res) => {
    const { childId } = req.params;
    try {
        const result = await db_1.pool.query('SELECT * FROM notifications WHERE child_id = $1 ORDER BY created_at DESC', [childId]);
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getNotificationsByChild = getNotificationsByChild;
const markAsRead = async (req, res) => {
    const { notificationId } = req.params;
    try {
        await db_1.pool.query('UPDATE notifications SET is_read = TRUE WHERE id = $1', [notificationId]);
        res.status(200).json({ message: 'Marked as read' });
    }
    catch (err) {
        console.error('Error updating notification:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.markAsRead = markAsRead;
// src/controllers/notificationController.ts
const createNotification = async (req, res) => {
    const { childId, message } = req.body;
    try {
        await db_1.pool.query(`INSERT INTO notifications (child_id, message)
       VALUES ($1, $2)`, [childId, message]);
        res.status(201).json({ message: 'Notification sent' });
    }
    catch (err) {
        console.error('Error creating notification:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.createNotification = createNotification;
