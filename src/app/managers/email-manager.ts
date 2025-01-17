import { injectable } from 'inversify';
import { emailAdapter } from '../adapters/email-adapter';
import {
    getEmailConfirmationTemplate,
    getPasswordRecoveryTemplate,
} from '../../shared/helpers';

@injectable()
export class EmailManager {
    async sendEmailConfirmationMessage(
        email: string,
        confirmationCode: string
    ) {
        const htmlTemplate = getEmailConfirmationTemplate(confirmationCode);
        const subject = 'Confirm your registration email';
        emailAdapter(email, subject, htmlTemplate);
    }

    async sendEmailPasswordRecoveryMessage(
        email: string,
        confirmationCode: string
    ) {
        const htmlTemplate = getPasswordRecoveryTemplate(confirmationCode);
        const subject = 'Confirm your password recovery email';
        emailAdapter(email, subject, htmlTemplate);
    }
}
