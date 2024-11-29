import { Schema } from 'express-validator';
import { requestValidator } from '../../helpers';
import { ObjectId } from 'mongodb';
import { postsBodySchema } from '../../posts/middlewares';

const nameLength = 15;
const descriptionLength = 500;
const websiteUrlLength = 100;
const websiteUrlPattern =
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

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

export const blogsBodySchema: Schema = {
    name: {
        in: ['body'],
        exists: {
            errorMessage: 'Name is required',
        },
        isString: true,
        trim: true,
        notEmpty: {
            errorMessage: 'Name is required',
        },
        isLength: {
            options: { max: nameLength },
            errorMessage: `Name length should be max ${nameLength} characters`,
        },
    },
    description: {
        in: ['body'],
        exists: {
            errorMessage: 'Description is required',
        },
        isString: true,
        trim: true,
        notEmpty: {
            errorMessage: 'Description is required',
        },
        isLength: {
            options: { max: descriptionLength },
            errorMessage: `Description length should be max ${descriptionLength} characters`,
        },
    },
    websiteUrl: {
        in: ['body'],
        exists: {
            errorMessage: 'WebsiteUrl is required',
        },
        isString: true,
        trim: true,
        notEmpty: {
            errorMessage: 'WebsiteUrl is required',
        },
        isLength: {
            options: { max: websiteUrlLength },
            errorMessage: `Website URL length should be max ${websiteUrlLength} characters`,
        },
        matches: {
            options: websiteUrlPattern,
            errorMessage: 'Website URL should be a valid URL',
        },
    },
};

const searchNameTermQuerySchema: Schema = {
    searchNameTerm: {
        in: ['query'],
        optional: true,
        isString: true,
        errorMessage: 'searchNameTerm must be a string',
    },
};

delete postsBodySchema.blogId;

export const blogsValidators = {
    getBlogsRequest: requestValidator({
        querySchema: searchNameTermQuerySchema,
    }),
    getBlogRequest: requestValidator({ paramSchema }),
    getBlogPostsRequest: requestValidator({ paramSchema, querySchema: searchNameTermQuerySchema }),
    createNewBlogRequest: requestValidator({ bodySchema: blogsBodySchema }),
    createNewPostForBlogRequest: requestValidator({ bodySchema: postsBodySchema, paramSchema }),
    updateBlogRequest: requestValidator({ bodySchema: blogsBodySchema, paramSchema }),
    deleteBlogRequest: requestValidator({ paramSchema }),
};
