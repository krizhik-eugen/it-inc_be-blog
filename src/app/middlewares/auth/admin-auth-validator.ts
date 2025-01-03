import { checkSchema, Schema } from 'express-validator';
import { errorAuthValidator } from './auth-validator-helpers';

export const adminAuthSchema: Schema = {
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

export const adminAuthValidator = [
    checkSchema(adminAuthSchema),
    errorAuthValidator,
];
