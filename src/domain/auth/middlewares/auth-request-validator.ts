import { Schema } from 'express-validator';
import { requestValidator } from '../../../shared/helpers';

export const authBodySchema: Schema = {
    loginOrEmail: {
        in: ['body'],
        exists: {
            errorMessage: 'Login or email is required',
        },
        isString: true,
        trim: true,
        notEmpty: {
            errorMessage: 'Login or email is required',
        },
    },
    password: {
        in: ['body'],
        exists: {
            errorMessage: 'Password is required',
        },
        isString: true,
        trim: true,
        notEmpty: {
            errorMessage: 'Password is required',
        },
    },
};

export const authValidators = {
    loginRequest: requestValidator({ bodySchema: authBodySchema }),
};
