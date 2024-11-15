import { checkSchema, Schema } from 'express-validator';
import { errorAuthValidator } from './authValidatorHelpers';

export const authSchema: Schema = {
    Authorization: {
        in: ['headers'],
        custom: {
            options: (value) => {
                const expectedToken = process.env.AUTH_ADMIN;
                console.log('expectedToken', expectedToken);
                const decodedValue = Buffer.from(
                    value.replace('Basic ', ''),
                    'base64'
                ).toString('utf8');
                console.log('decodedValue', decodedValue);
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
