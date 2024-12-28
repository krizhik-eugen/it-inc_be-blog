import { Schema } from 'express-validator';
import { requestValidator } from '../../../shared/helpers';

const loginMaxLength = 10;
const loginMinLength = 3;
const loginPattern = /^[a-zA-Z0-9_-]*$/;
const passwordMinLength = 6;
const passwordMaxLength = 20;
const emailPattern = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/;

const paramSchema: Schema = {
    id: {
        in: ['params'],
        isMongoId: {
            errorMessage: 'Invalid Id',
        },
    },
};

export const usersBodySchema: Schema = {
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

export const usersQuerySchema: Schema = {
    searchLoginTerm: {
        in: ['query'],
        optional: true,
        isString: true,
        errorMessage: 'searchLoginTerm must be a string',
    },
    searchEmailTerm: {
        in: ['query'],
        optional: true,
        isString: true,
        errorMessage: 'searchEmailTerm must be a string',
    },
    sortBy: {
        in: ['query'],
        optional: true,
        isIn: {
            options: [['createdAt', 'login', 'email']],
            errorMessage:
                "sortBy must be either 'createdAt', 'login' or 'email'",
        },
    },
    sortDirection: {
        in: ['query'],
        optional: true,
        isIn: {
            options: [['asc', 'desc']],
            errorMessage: 'sortDirection must be either "asc" or "desc"',
        },
    },
    pageNumber: {
        in: ['query'],
        optional: true,
        isInt: {
            options: { min: 0 },
            errorMessage: 'pageNumber must be a non-negative integer',
        },
        toInt: true,
    },
    pageSize: {
        in: ['query'],
        optional: true,
        isInt: {
            options: { min: 1 },
            errorMessage: 'pageSize must be a positive integer',
        },
        toInt: true,
    },
};

export const usersValidators = {
    getUsersRequest: requestValidator({ querySchema: usersQuerySchema }),
    createNewUserRequest: requestValidator({ bodySchema: usersBodySchema }),
    deleteUserRequest: requestValidator({ paramSchema }),
};
