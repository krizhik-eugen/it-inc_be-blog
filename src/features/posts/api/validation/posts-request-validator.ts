import { Schema } from 'express-validator';
import { container } from '../../../../app-composition-root';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs-repository';
import { requestValidator } from '../../../../shared/helpers';
import {
    commentsBodySchema,
    commentsQuerySchema,
} from '../../../comments/comments-request-validator';
import {
    postContentValidation,
    postShortDescriptionValidation,
    postTitleValidation,
} from '../../domain/settings';

const blogsRepository = container.get(BlogsRepository);

const paramSchema: Schema = {
    id: {
        in: ['params'],
        isMongoId: {
            errorMessage: 'Invalid Id',
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
            options: { max: postTitleValidation.maxLength },
            errorMessage: `Title length should be max ${postTitleValidation.maxLength} characters`,
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
            options: { max: postShortDescriptionValidation.maxLength },
            errorMessage: `ShortDescription length should be max ${postShortDescriptionValidation.maxLength} characters`,
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
            options: { max: postContentValidation.maxLength },
            errorMessage: `Content length should be max ${postContentValidation.maxLength} characters`,
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
            errorMessage: 'Invalid Id',
        },
        custom: {
            options: async (value: string) => {
                const blog = await blogsRepository.findBlogById(value);
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

export const likeStatusBodySchema: Schema = {
    likeStatus: {
        in: ['body'],
        exists: {
            errorMessage: 'Like status is required',
        },
        isString: true,
        trim: true,
        notEmpty: {
            errorMessage: 'Like status is required',
        },
        isIn: {
            options: [['Like', 'Dislike', 'None']],
            errorMessage:
                'Like status must be one of the following: Like, Dislike, None',
        },
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
    updateLikeStatusRequest: requestValidator({
        paramSchema,
        bodySchema: likeStatusBodySchema,
    }),
    deletePostRequest: requestValidator({ paramSchema }),
};
