import prisma from "../configs/prisma.js";


// Create task 
export const createTask = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { projectId, title, description, type, status, priority, assigneeId, due_date } = req.body;
        const origin = res.get('origin');

        // Check if user have admin role for project
        const project = await prisma.project.findUnique({
            where: { id: projectId},
            include: { members: { include: { user: true}}}
        })

        if(!project) {
            return res.status(404).json({ message: "Project not found"})

        } else if(!project.team_lead !== userId) {
            return res.status(403).json({ message: "You don't have admin privileges"})

        }else if(assigneeId && !project.members.find((member) => member.userId === assigneeId)) {
            return res.status(403).json({ message: "Assignee is not member of the project / workspace"});
        }

        const task = await prisma.task.create({
            data: {
                projectId,
                title,
                description,
                priority,
                assigneeId,
                status,
                due_date: new Date(due_date)
            }
        })

        const taskWithAssignee = await prisma.task.findUnique({
            where: { id: task.id},
            include: { assignee: true }
        })

        res.json({ task: taskWithAssignee, message: "Task created successfully"})

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message});
    }
}