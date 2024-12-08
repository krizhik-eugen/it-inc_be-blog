import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants';
import {
    TCreateNewPostCommentRequest,
    TCreateNewPostCommentResponse,
    TCreateNewPostRequest,
    TCreateNewPostResponse,
    TDeletePostRequest,
    TGetAllPostCommentsRequest,
    TGetAllPostCommentsResponse,
    TGetAllPostsRequest,
    TGetAllPostsResponse,
    TGetPostRequest,
    TGetPostResponse,
    TUpdatePostRequest,
} from '../types';
import { postsService } from '../service';
import { postsQueryRepository } from '../repository';
import { commentsQueryRepository, commentsService } from '../../comments';

export const postsController = {
    async getAllPosts(req: TGetAllPostsRequest, res: TGetAllPostsResponse) {
        const posts = await postsQueryRepository.getPosts(req);
        res.status(HTTP_STATUS_CODES.OK).json(posts);
    },

    async getPost(req: TGetPostRequest, res: TGetPostResponse) {
        const foundPost = await postsQueryRepository.getPost(req.params.id);
        if (!foundPost) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(foundPost);
    },

    async getPostComments (req: TGetAllPostCommentsRequest, res: TGetAllPostCommentsResponse) {
        const result = await commentsQueryRepository.getPostComments(req);
        if ('errorsMessages' in result) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(result);
    },

    async createNewPost(
        req: TCreateNewPostRequest,
        res: TCreateNewPostResponse
    ) {
        const result = await postsService.createNewPost(req);
        if (typeof result !== 'string' && 'errorsMessages' in result) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(result);
            return;
        }
        const createdPost = await postsQueryRepository.getPost(result);
        if (!createdPost) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.CREATED).json(createdPost);
    },
    async createNewCommentForPost(req: TCreateNewPostCommentRequest, res: TCreateNewPostCommentResponse) {
        const result = await commentsService.createNewCommentForPost(req);
        if (typeof result !== 'string' && 'errorsMessages' in result) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        const createdComment = await commentsQueryRepository.getComment(result);
        if (!createdComment) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.CREATED).json(createdComment);
    },

    async updatePost(req: TUpdatePostRequest, res: Response) {
        const isPostUpdated = await postsService.updatePost(req);
        res.sendStatus(
            isPostUpdated
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },

    async deletePost(req: TDeletePostRequest, res: Response) {
        const isPostDeleted = await postsService.deletePost(req);
        res.sendStatus(
            isPostDeleted
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },
};
