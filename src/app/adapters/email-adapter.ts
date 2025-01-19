import nodemailer from 'nodemailer';
import { hostEmailLogin, hostEmailPassword } from '../configs/app-config';

export const emailAdapter = async (
    email: string,
    subject: string,
    html: string
) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: hostEmailLogin,
            pass: hostEmailPassword,
        },
    });
    const info = await transporter.sendMail({
        from: `"Blogs platform" ${hostEmailLogin}`,
        to: email,
        subject,
        html,
    });
    return info;
};
