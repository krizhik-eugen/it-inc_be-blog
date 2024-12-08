import { ObjectId } from 'mongodb';
import { Schema } from 'express-validator';
import { requestValidator } from '../../helpers';
import { blogsRepository } from '../../blogs';
import { commentsBodySchema, commentsQuerySchema } from '../../comments';

const titleLength = 30;
const shortDescriptionLength = 100;
const contentLength = 1000;

const paramSchema: Schema = {
    id: {
        in: ['params'],
        isMongoId: {
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
        isMongoId: {
            errorMessage: 'Invalid BlogId',
        },
        custom: {
            options: async (value: string) => {
                //TODO: why we do here the search (required in home tasks)
                const blog = await blogsRepository.findBlogById(
                    new ObjectId(value)
                );
                if (!blog) {
                    throw 'Incorrect Blog Id, no blogs found';
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
            errorMessage:
                "sortBy must be either 'createdAt', 'title' or 'blogName'",
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
    getPostRequest: requestValidator({ paramSchema }),
    getPostsRequest: requestValidator({ querySchema: postsQuerySchema }),
    getPostCommentsRequest: requestValidator({
        paramSchema,
        querySchema: commentsQuerySchema,
    }),
    createNewPostRequest: requestValidator({ bodySchema: postsBodySchema }),
    createNewCommentForPostRequest: requestValidator({
        bodySchema: commentsBodySchema,
        paramSchema,
    }),
    updatePostRequest: requestValidator({
        bodySchema: postsBodySchema,
        paramSchema,
    }),
    deletePostRequest: requestValidator({ paramSchema }),
};
