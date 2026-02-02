import { Router } from 'express';
import { addMember, createProject, updateProject } from '../controllers/project.controllers.js';


const projectRouter = Router();

projectRouter.post('/', createProject)
projectRouter.put('/', updateProject)
projectRouter.post('/:projectId/addMember', addMember)

export default projectRouter;