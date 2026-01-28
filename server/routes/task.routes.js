import { createTask, deleteTask, updateTask } from "../controllers/task.controllers.js";
import { Router } from 'express';


const taskRouter = Router();

taskRouter.post('/', createTask);
taskRouter.put('/:id', updateTask);
taskRouter.post('/delete', deleteTask)

export default taskRouter