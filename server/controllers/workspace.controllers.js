import prisma from "../configs/prisma.js";

// Get all workspaces from user
export const getUserWorkspaces = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const workspaces = await prisma.workspace.findMany({
        where: {
            members: { some: { userId }}
        },
        include: {
            members: { include: { user: true }},
            projects: {
                include: { 
                    tasks: { include: { assignee: true,  comments: { include: { 
                        user: true }}}},
                    members: { include: { user: true}}
                }
            },
            owner: true
        }
        });

        res.json({ workspaces });

    } catch (error) {
        console.error("Error fetching workspaces:", error);
        res.status(500).json({
        message: error.code || error.message
        });
    }
};

export const addMember = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { workspaceId, email, role, message } = req.body;

        if (!workspaceId || !email || !role) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (!["ADMIN", "MEMBER"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            include: { members: true }
        });

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const isAdmin = workspace.members.some(
            (member) => member.userId === userId && member.role === "ADMIN"
        );

        if (!isAdmin) {
            return res.status(403).json({
                message: "Only admins can add members"
            });
        }

        if (user.id === userId) {
            return res.status(400).json({
                message: "You are already a member of this workspace"
            });
        }

        const existingMember = workspace.members.find(
            (member) => member.userId === user.id
        );

        if (existingMember) {
            return res.status(400).json({
                message: "User is already a member of the workspace"
            });
        }

        const member = await prisma.workspaceMember.create({
            data: {
                userId: user.id,
                workspaceId,
                role,
                message
            }
        });

        res.status(201).json({
            member,
            message: "Member added successfully"
        });

    } catch (error) {
        console.error("Error adding member to workspace:", error);
        res.status(500).json({
            message: error.code || error.message
        });
    }
};
