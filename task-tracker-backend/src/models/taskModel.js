"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTask = void 0;
const db_1 = require("../config/db");
const createTask = async (task) => {
    const query = `
    INSERT INTO tasks (parent_id, child_id, title, description, due_date, xp_reward, status, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, 'Pending', NOW())
    RETURNING *;
  `;
    const values = [
        task.parentId,
        task.childId,
        task.title,
        task.description,
        task.dueDate,
        task.xpReward,
    ];
    const result = await db_1.pool.query(query, values);
    return result.rows[0];
};
exports.createTask = createTask;
