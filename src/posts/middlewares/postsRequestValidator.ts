import { Schema } from 'express-validator';
import { blogsModel } from '../../blogs';
import { requestValidator } from '../../helpers';

const titleLength = 30;
const shortDescriptionLength = 100;
const contentLength = 1000;

const paramSchema: Schema = {
    id: {
        in: ['params'],
        isString: true,
        notEmpty: {
            errorMessage: 'ID is required',
        },
    },
};

const bodySchema: Schema = {
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
                const foundBlog = await blogsModel.getBlog(value);
                if (!foundBlog) {
                    throw 'Invalid BlogId';
                }
                return true;
            },
        },
    },
};

export const postsValidators = {
    postRequest: requestValidator(bodySchema),
    putRequest: requestValidator(bodySchema, paramSchema),
};
