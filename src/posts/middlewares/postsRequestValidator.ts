import { Schema } from 'express-validator';
import { blogsModel } from '../../blogs';
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
                const isValid = ObjectId.isValid(value);
                if (!isValid) {
                    throw 'Invalid BlogId';
                }
                const foundBlog = await blogsModel.getBlog(value);
                if (!foundBlog) {
                    throw 'Incorrect BlogId, no blogs associated';
                }
                return true;
            },
        },
    },
};

export const postsValidators = {
    getRequest: requestValidator(paramSchema),
    postRequest: requestValidator(bodySchema),
    putRequest: requestValidator(bodySchema, paramSchema),
    deleteRequest: requestValidator(paramSchema),
};
