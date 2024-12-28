import { Schema } from 'express-validator';
import { requestValidator } from '../../../shared/helpers';

const loginMaxLength = 10;
const loginMinLength = 3;
const loginPattern = /^[a-zA-Z0-9_-]*$/;
const passwordMinLength = 6;
const passwordMaxLength = 20;
const emailPattern = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/;

export const loginBodySchema: Schema = {
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

export const registrationBodySchema: Schema = {
    login: {
        in: ['body'],
        exists: {
            errorMessage: 'Login is required',
        },
        isString: true,
        trim: true,
        notEmpty: {
            errorMessage: 'Login is required',
        },
        isLength: {
            options: { min: loginMinLength, max: loginMaxLength },
            errorMessage: `Login length should be min ${loginMinLength} and max ${loginMaxLength} characters`,
        },
        matches: {
            options: loginPattern,
            errorMessage:
                'Login should contain only latin letters, numbers, - and _',
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
        isLength: {
            options: { min: passwordMinLength, max: passwordMaxLength },
            errorMessage: `Password length should be min ${passwordMinLength} and max ${passwordMaxLength} characters`,
        },
    },
    email: {
        in: ['body'],
        exists: {
            errorMessage: 'Email is required',
        },
        isString: true,
        trim: true,
        notEmpty: {
            errorMessage: 'Email is required',
        },
        matches: {
            options: emailPattern,
            errorMessage:
                'Email should be a valid email address, example: example@example.com',
        },
    },
};

export const confirmationBodySchema: Schema = {
    code: {
        in: ['body'],
        exists: {
            errorMessage: 'Confirmation code is required',
        },
        isString: true,
        trim: true,
        notEmpty: {
            errorMessage: 'Confirmation code is required',
        },
        isUUID: {
            errorMessage: 'Invalid confirmation code',
        },
    },
};

export const resendRegistrationBodySchema: Schema = {
    email: {
        in: ['body'],
        exists: {
            errorMessage: 'Email is required',
        },
        isString: true,
        trim: true,
        notEmpty: {
            errorMessage: 'Email is required',
        },
        matches: {
            options: emailPattern,
            errorMessage:
                'Email should be a valid email address, example: example@example.com',
        },
    },
};

export const authValidators = {
    loginRequest: requestValidator({ bodySchema: loginBodySchema }),
    registrationRequest: requestValidator({
        bodySchema: registrationBodySchema,
    }),
    confirmationRequest: requestValidator({
        bodySchema: confirmationBodySchema,
    }),
    resendRegistrationRequest: requestValidator({
        bodySchema: resendRegistrationBodySchema,
    }),
};
