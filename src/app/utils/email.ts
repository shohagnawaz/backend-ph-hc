import nodemailer from "nodemailer";
import { envVars } from "../config/env";

const transporter = nodemailer.createTransport({
    host: envVars.EMAIL_SENDER.SMTP_HOST,
    secure: true,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS
    },
    port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
});

interface sendEmailOptions {
    to: String,
    message: String,
    html: String
}

export const sendEmail = async (payload) => {}