import { Schema } from 'express-validator';
import { blogsRepository } from '../../blogs';
import { requestValidator } from '../../helpers';
import { ObjectId } from 'mongodb';

const titleLength = 30;
const shortDescriptionLength = 100;
const contentLength = 1000;

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

export const postsBodySchema: Schema = {
    title: {
        in: ['body'],
        exists: {
            errorMessage: 'Title is required',
        },
        isString: true,
        trim: true,
        notEmpty: {
            errorMessage: 'Title is required',
        },
        isLength: {
            options: { max: titleLength },
            errorMessage: `Title length should be max ${titleLength} characters`,
        },
    },
    shortDescription: {
        in: ['body'],
        exists: {
            errorMessage: 'ShortDescription is required',
        },
        isString: true,
        trim: true,
        notEmpty: {
            errorMessage: 'ShortDescription is required',
        },
        isLength: {
            options: { max: shortDescriptionLength },
            errorMessage: `ShortDescription length should be max ${shortDescriptionLength} characters`,
        },
    },
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
            options: { max: contentLength },
            errorMessage: `Content length should be max ${contentLength} characters`,
        },
    },
    blogId: {
        in: ['body'],
        exists: {
            errorMessage: 'BlogId is required',
        },
        isString: true,
        trim: true,
        notEmpty: {
            errorMessage: 'BlogId is required',
        },
        custom: {
            options: async (value) => {
                const isValid = ObjectId.isValid(value);
                if (!isValid) {
                    throw 'Invalid BlogId';
                }
                const foundBlog = await blogsRepository.getBlog(value);
                if (!foundBlog) {
                    throw 'Incorrect BlogId, no blogs associated';
                }
                return true;
            },
        },
    },
};

export const postsQuerySchema: Schema = {
    sortBy: {
        in: ['query'],
        optional: true,
        isIn: {
            options: [['createdAt', 'title', 'blogName']],
            errorMessage: "sortBy must be either 'createdAt', 'title' or 'blogName'",
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

export const postsValidators = {
    getPostRequest: requestValidator({ paramSchema, querySchema: postsQuerySchema }),
    createNewPostRequest: requestValidator({ bodySchema: postsBodySchema }),
    updatePostRequest: requestValidator({ bodySchema: postsBodySchema, paramSchema }),
    deletePostRequest: requestValidator({ paramSchema }),
};
