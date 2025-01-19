import { Schema } from 'express-validator';
import { requestValidator } from '../../../../shared/helpers';
import {
    userEmailValidation,
    userLoginValidation,
} from '../../../users/domain/settings';

const passwordMinLength = 6;
const passwordMaxLength = 20;

const loginFieldSchema: Schema[''] = {
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
        options: {
            min: userLoginValidation.minLength,
            max: userLoginValidation.maxLength,
        },
        errorMessage: `Login length should be min ${userLoginValidation.minLength} and max ${userLoginValidation.maxLength} characters`,
    },
    matches: {
        options: userLoginValidation.pattern,
        errorMessage: userLoginValidation.errorMessagePattern,
    },
};

const emailFieldSchema: Schema[''] = {
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
        options: userEmailValidation.pattern,
        errorMessage: userEmailValidation.errorMessagePattern,
    },
};

const passwordFieldSchema: Schema[''] = {
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
};

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
    password: passwordFieldSchema,
};

export const registrationBodySchema: Schema = {
    login: loginFieldSchema,
    password: passwordFieldSchema,
    email: emailFieldSchema,
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
    email: emailFieldSchema,
};

export const passwordRecoveryBodySchema: Schema = {
    email: emailFieldSchema,
};

export const newPasswordBodySchema: Schema = {
    newPassword: passwordFieldSchema,
    recoveryCode: {
        in: ['body'],
        exists: {
            errorMessage: 'Recovery code is required',
        },
        isString: true,
        trim: true,
        notEmpty: {
            errorMessage: 'Recovery code is required',
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
    passwordRecoveryRequest: requestValidator({
        bodySchema: passwordRecoveryBodySchema,
    }),
    newPasswordRequest: requestValidator({
        bodySchema: newPasswordBodySchema,
    }),
};
