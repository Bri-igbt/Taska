import prisma from "../configs/prisma.js";

// Get all workspaces from user
export const getUserWorkspaces = async (req, res) => {
    try {
        const { userId } = await req.auth();

        const workspaces = await prisma.workspace.findMany({
        where: {
            members: {
            some: { userId }
            }
        },
        include: {
            members: {
            include: { user: true }
            },
            projects: {
            include: {
                tasks: {
                include: {
                    assignee: true,   
                    comments: {       
                    include: {
                        user: true
                    }
                    }
                }
                },
                members: {
                include: {
                    user: true
                }
                }
            }
            },
            owner: true
        }
        });

        res.status(200).json({ workspaces });
    } catch (error) {
        console.error("Error fetching workspaces:", error);
        res.status(500).json({
        message: error.code || error.message
        });
    }
};



// Add member to workspace
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

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch workspace with members
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            include: { members: true }
        });

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        // Only ADMIN can add members
        const isAdmin = workspace.members.some(
            (member) => member.userId === userId && member.role === "ADMIN"
        );

        if (!isAdmin) {
        return res
            .status(403)
            .json({ message: "Only ADMIN members can add new members" });
        }

        // Prevent duplicate membership
        const existingMember = workspace.members.some(
            (member) => member.userId === user.id
        );

        if (existingMember) {
        return res
            .status(400)
            .json({ message: "User is already a member of the workspace" });
        }

        // Add member
        const newMember = await prisma.workspaceMember.create({
            data: {
                workspaceId,
                userId: user.id,
                role,
                message
            }
        });

        res.status(201).json({
            member: newMember,
            message: "Member added successfully"
        });
    } catch (error) {
        console.error("Error adding member to workspace:", error);
        res.status(500).json({
            message: error.code || error.message
        });
    }
};
