import { Schema } from 'express-validator';
import { requestValidator } from '../../helpers';
import { ObjectId } from 'mongodb';
import { postsBodySchema, postsQuerySchema } from '../../posts/middlewares';

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

export const blogsQuerySchema: Schema = {
    searchNameTerm: {
        in: ['query'],
        optional: true,
        isString: true,
        errorMessage: 'searchNameTerm must be a string',
    },
    sortBy: {
        in: ['query'],
        optional: true,
        isIn: {
            options: [['createdAt', 'name']],
            errorMessage: "sortBy must be either 'createdAt' or 'name'",
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

delete postsBodySchema.blogId;

export const blogsValidators = {
    getBlogsRequest: requestValidator({
        querySchema: blogsQuerySchema,
    }),
    getBlogRequest: requestValidator({ paramSchema }),
    getBlogPostsRequest: requestValidator({ paramSchema, querySchema: postsQuerySchema }),
    createNewBlogRequest: requestValidator({ bodySchema: blogsBodySchema }),
    createNewPostForBlogRequest: requestValidator({ bodySchema: postsBodySchema, paramSchema }),
    updateBlogRequest: requestValidator({ bodySchema: blogsBodySchema, paramSchema }),
    deleteBlogRequest: requestValidator({ paramSchema }),
};
