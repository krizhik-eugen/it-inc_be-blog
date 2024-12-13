import { Schema } from 'express-validator';
import { requestValidator } from '../../../shared/helpers';

const contentMinLength = 20;
const contentMaxLength = 300;

const paramSchema: Schema = {
    id: {
        in: ['params'],
        isMongoId: {
            errorMessage: 'Invalid Id',
        },
    },
};

export const commentsBodySchema: Schema = {
    content: {
        in: ['body'],
        exists: {
            errorMessage: 'Content is required',
        },
        isString: true,
        trim: true,
        notEmpty: {
            errorMessage: 'Content is required',
        },
        isLength: {
            options: { min: contentMinLength, max: contentMaxLength },
            errorMessage: `Content length should be min ${contentMinLength} and max ${contentMaxLength} characters`,
        },
    },
};

export const commentsQuerySchema: Schema = {
    sortBy: {
        in: ['query'],
        optional: true,
        isIn: {
            options: [['createdAt']],
            errorMessage: "sortBy must be 'createdAt'",
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

export const commentsValidators = {
    getCommentRequest: requestValidator({ paramSchema }),
    updateCommentRequest: requestValidator({
        bodySchema: commentsBodySchema,
        paramSchema,
    }),
    deleteCommentRequest: requestValidator({ paramSchema }),
};
