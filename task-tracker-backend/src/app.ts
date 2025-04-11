// src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import taskRoutes from './routes/taskRoutes';
import submissionRoutes from './routes/submissionRoutes';
import userRoutes from './routes/userRoutes';
import notificationRoutes from './routes/notificationRoutes';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

app.use('/api/submissions', submissionRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/auth', authRoutes);

export default app;
