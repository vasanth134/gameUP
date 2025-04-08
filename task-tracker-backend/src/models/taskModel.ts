import { pool } from '../config/db';

export const createTask = async (task: {
  parentId: number;
  childId: number;
  title: string;
  description: string;
  dueDate: string;
  xpReward: number;
}) => {
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

  const result = await pool.query(query, values);
  return result.rows[0];
};
