import { ObjectId } from 'mongodb';
import { Schema } from 'express-validator';
import { requestValidator } from '../../helpers';

const loginMaxLength = 30;
const loginMinLength = 3;
const loginPattern = /^[a-zA-Z0-9_-]*$/;
const passwordMinLength = 6;
const passwordMaxLength = 20;
const emailPattern = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/;

const paramSchema: Schema = {
    id: {
        in: ['params'],
        isString: true,
        custom: {
            options: (value) => ObjectId.isValid(value),
            errorMessage: 'ID is not a valid ObjectId',
        },
    },
};

export const usersBodySchema: Schema = {
    login: {
        in: ['body'],
        optional: true,
        custom: {
            options: (value): boolean => {
                if (!value) return true; // Allow falsy values
                if (typeof value !== 'string') return false;
                const trimmedValue = value.trim();
                const lengthValid = trimmedValue.length >= loginMinLength && trimmedValue.length <= loginMaxLength;
                const patternValid = loginPattern.test(trimmedValue);
                return lengthValid && patternValid;
            },
            errorMessage: `Login should be empty or contain only latin letters, numbers, - and _, with length between ${loginMinLength} and ${loginMaxLength} characters`,
        },
    },
    email: {
        in: ['body'],
        optional: true,
        custom: {
            options: (value) => !value || emailPattern.test(value),
            errorMessage: 'Email should be empty or a valid email address, example: example@example.com',
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
