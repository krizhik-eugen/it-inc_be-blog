import {
    getEmailConfirmationTemplate,
    getPasswordRecoveryTemplate,
} from '../../../shared/helpers';
import { emailAdapter } from '../../adapters';

export const emailManager = {
    async sendEmailConfirmationMessage(
        email: string,
        confirmationCode: string
    ) {
        const htmlTemplate = getEmailConfirmationTemplate(confirmationCode);
        const subject = 'Confirm your registration email';
        emailAdapter(email, subject, htmlTemplate);
    },

    async sendEmailPasswordRecoveryMessage(
        email: string,
        confirmationCode: string
    ) {
        const htmlTemplate = getPasswordRecoveryTemplate(confirmationCode);
        const subject = 'Confirm your password recovery email';
        emailAdapter(email, subject, htmlTemplate);
    },
};
