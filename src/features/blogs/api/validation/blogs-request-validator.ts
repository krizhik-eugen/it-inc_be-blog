import { Schema } from 'express-validator';
import { requestValidator } from '../../../../shared/helpers';
import {
    postsBodySchema,
    postsQuerySchema,
} from '../../../posts/api/validation/posts-request-validator';
import {
    blogDescriptionValidation,
    blogNameValidation,
    blogWebsiteUrlValidation,
} from '../../domain/settings';

const paramSchema: Schema = {
    id: {
        in: ['params'],
        isMongoId: {
            errorMessage: 'Invalid Id',
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
            options: { max: blogNameValidation.maxLength },
            errorMessage: `Name length should be max ${blogNameValidation.maxLength} characters`,
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
            options: { max: blogDescriptionValidation.maxLength },
            errorMessage: `Description length should be max ${blogDescriptionValidation.maxLength} characters`,
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
            options: { max: blogWebsiteUrlValidation.maxLength },
            errorMessage: `Website URL length should be max ${blogWebsiteUrlValidation.maxLength} characters`,
        },
        matches: {
            options: blogWebsiteUrlValidation.pattern,
            errorMessage: blogWebsiteUrlValidation.errorMessagePattern,
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

delete postsBodySchema?.blogId;

export const blogsValidators = {
    getBlogsRequest: requestValidator({
        querySchema: blogsQuerySchema,
    }),
    getBlogRequest: requestValidator({ paramSchema }),
    getBlogPostsRequest: requestValidator({
        paramSchema,
        querySchema: postsQuerySchema,
    }),
    createNewBlogRequest: requestValidator({ bodySchema: blogsBodySchema }),
    createNewPostForBlogRequest: requestValidator({
        bodySchema: postsBodySchema,
        paramSchema,
    }),
    updateBlogRequest: requestValidator({
        bodySchema: blogsBodySchema,
        paramSchema,
    }),
    deleteBlogRequest: requestValidator({ paramSchema }),
};
