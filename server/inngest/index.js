import { Inngest } from "inngest";
import  prisma  from '../configs/prisma.js'

// Create a client to send and receive events
export const inngest = new Inngest({ id: "Taska" });

// Inngest function to save user data to database
const saveUserData = inngest.createFunction(
    { id: "sync-user-from-clerk"},
    { event: "clerk/user.created" },
    async ({ event }) => {
        const { data } = event
        // Simulate saving user data to database
        await prisma.user.create({
            data: {
                id: data.id,
                email: data.email_addresses[0]?.email_address,
                name: data.first_name + ' ' + data.last_name,
                image: data?.image_url
            },
        })
    }
)

// Inngest function to delete user data from database
const deleteUserData = inngest.createFunction(
    { id: "delete-user-with-clerk"},
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const { data } = event
        // Simulate deleting user data from database
        await prisma.user.deleteMany({
            where: {
                id: data.id,
            },
        })
    }
)

// Inngest function to update user data in database
const updateUserData = inngest.createFunction(
    { id: "update-user-with-clerk"},
    { event: "clerk/user.updated" },
    async ({ event }) => {
        const { data } = event
        // Simulate updating user data in database
        await prisma.user.updateMany({
            where: {
                id: data.id,
            },
            data: {
                email: data.email_addresses[0]?.email_address,
                name: data.first_name + ' ' + data.last_name,
                image: data?.image_url
            },
        })
    }
)

// Inngest function to save workspace data to database
const saveWorkspaceData = inngest.createFunction(
    { id: "sync-workspace-from-clerk"},
    { event: "clerk/workspace.created" },
    async ({ event }) => {
        const { data } = event
        // Simulate saving workspace data to database
        await prisma.workspace.create({
            data: {
                id: data.id,
                name: data.name,
                slug: data.slug,
                ownerId: data.created_by,
                image_url: data.image_url,
            },
        })

        // Add creator as ADMIN Member
        await prisma.workspaceMember.create({
            data: {
                userId: data.created_by,
                workspaceId: data.id,
                role: 'ADMIN',
            },
        })
    }
)

// Ingest function to update workspace data in database
const updateWorkspaceData = inngest.createFunction(
    { id: "update-workspace-with-clerk"},
    { event: "clerk/workspace.updated" },
    async ({ event }) => {
        const { data } = event
        // Simulate updating workspace data in database
        await prisma.workspace.updateMany({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                slug: data.slug,
                image_url: data.image_url,
            },
        })
    }
)

// Inngest function to delete workspace data from database
const deleteWorkspaceData = inngest.createFunction(
    { id: "delete-workspace-with-clerk"},
    { event: "clerk/workspace.deleted" },
    async ({ event }) => {
        const { data } = event
        // Simulate deleting workspace data from database
        await prisma.workspace.deleteMany({
            where: {
                id: data.id,
            },
        })
    }
)

// Inngest function to save workspace member data to database
const saveWorkspaceMemberData = inngest.createFunction(
    { id: "sync-workspace-member-from-clerk"},
    { event: "clerk/organizationInvitation.accepted" },
    async ({ event }) => {
        const { data } = event
        // Simulate saving workspace member data to database
        await prisma.workspaceMember.create({
            data: {
                userId: data.user_id,
                workspaceId: data.organization_id,
                role: String(data.role_name).toUpperCase(),
            },
        })
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    saveUserData,
    deleteUserData,
    updateUserData,
    saveWorkspaceData,
    updateWorkspaceData,
    deleteWorkspaceData,
    saveWorkspaceMemberData
];