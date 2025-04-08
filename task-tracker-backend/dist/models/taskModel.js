"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTask = void 0;
const db_1 = require("../config/db");
const createTask = (task) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield db_1.pool.query(query, values);
    return result.rows[0];
});
exports.createTask = createTask;
