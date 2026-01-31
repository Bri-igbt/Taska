import { Router } from 'express';
import { addComment, getTaskComments } from '../controllers/comments.controllers.js';

const commentRouter = Router();

commentRouter.post('/', addComment);
commentRouter.get('/:taskId', getTaskComments);

export default commentRouter