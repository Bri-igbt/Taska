import { Router } from 'express';
import { getUserWorkspaces, addMember } from '../controllers/workspace.controllers.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const workspaceRouter = Router();

// route to get all workspaces
workspaceRouter.get( '/', authMiddleware, getUserWorkspaces );
workspaceRouter.post( '/add-member', authMiddleware, addMember );

export default workspaceRouter;