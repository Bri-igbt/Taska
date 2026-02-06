import express from 'express';
import cors from 'cors';
import { PORT } from './configs/env.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import workspaceRouter from './routes/workspace.routes.js';
import { protect } from './middlewares/auth.middleware.js';
import projectRouter from './routes/project.routes.js';
import taskRouter from './routes/task.routes.js';
import commentRouter from './routes/comment.routes.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())

app.get('/', (req, res) => { res.send('Server is running') });

app.use("/api/inngest", serve({ client: inngest, functions }));

// Routes
app.use('/api/workspaces', protect, workspaceRouter);
app.use('/api/projects', protect, projectRouter);
app.use('/api/tasks', protect, taskRouter);
app.use('/api/comments', protect, commentRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});