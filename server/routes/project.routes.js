import { Router } from 'express';
import { AddMember, createProject, updateProject } from '../controllers/project.controllers.js';


const projectRouter = Router();

projectRouter.post('/', createProject)
projectRouter.put('/', updateProject)
projectRouter.post('/:projectId/addMember', AddMember)

export default projectRouter;