import nodemailer from "nodemailer"
import { SENDER_EMAIL, SMTP_PASS, SMTP_USER } from "./env.js";

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

const sendEmail = async ({ to, subject, body }) => {
    const response = await transporter.sendMail({
        from: SENDER_EMAIL,
        to,
        subject,
        html: body, 
    });

    return response
};

export default sendEmail
