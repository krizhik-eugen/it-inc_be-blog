import { checkSchema, Schema } from 'express-validator';
import { errorAuthValidator } from './authValidatorHelpers';

export const authSchema: Schema = {
    Authorization: {
        in: ['headers'],
        custom: {
            options: (value) => {
                const expectedToken = process.env.ADMIN_AUTH;
                const decodedValue = Buffer.from(
                    value.replace('Basic ', ''),
                    'base64'
                ).toString('utf8');
                if (decodedValue !== expectedToken) {
                    return false;
                }
                return true;
            },
            errorMessage: 'Invalid Authorization token',
        },
    },
};

export const authValidator = [checkSchema(authSchema), errorAuthValidator];
