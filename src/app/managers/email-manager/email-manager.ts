import nodemailer from 'nodemailer';
import { getEmailConfirmationTemplate } from '../../../shared/helpers';
import { hostEmailLogin, hostEmailPassword } from '../../configs/app-config';

export const emailManager = {
    async sendEmailConfirmationMessage(
        email: string,
        confirmationCode: string
    ) {
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
            subject: 'Confirm your registration email',
            html: getEmailConfirmationTemplate(confirmationCode),
        });
        return info;
    },
};
