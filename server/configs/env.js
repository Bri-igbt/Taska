import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {
    PORT,
    SERVER_URL,
    CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY,
    DATABASE_URL,
    DIRECT_URL,
    NODE_ENV,
    CLERK_WEBHOOK_SECRET,
    INNGEST_EVENT_KEY,
    INNGEST_SIGNING_KEY,
} = process.env;