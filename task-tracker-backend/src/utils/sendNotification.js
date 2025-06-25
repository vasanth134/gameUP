"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
// ✅ src/utils/sendNotification.ts
const db_1 = require("../config/db");
const sendNotification = async (childId, message) => {
    try {
        await db_1.pool.query('INSERT INTO notifications (child_id, message) VALUES ($1, $2)', [childId, message]);
    }
    catch (err) {
        console.error('Error sending notification:', err);
    }
};
exports.sendNotification = sendNotification;
