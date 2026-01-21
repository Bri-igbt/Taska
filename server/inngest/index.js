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

// Create an empty array where we'll export future Inngest functions
export const functions = [
    saveUserData,
    deleteUserData,
    updateUserData
];