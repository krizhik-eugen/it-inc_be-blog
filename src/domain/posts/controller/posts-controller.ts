import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
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
import {
    CommentsDBSearchParams,
    commentsQueryRepository,
    commentsService,
} from '../../comments';
import { PostsDBSearchParams } from '../model';
import { getSearchQueries } from '../../../shared/helpers';

export const postsController = {
    async getAllPosts(req: TGetAllPostsRequest, res: TGetAllPostsResponse) {
        const searchQueries = getSearchQueries<PostsDBSearchParams['sortBy']>(
            req.query
        );
        const posts = await postsQueryRepository.getPosts({ searchQueries });
        res.status(HTTP_STATUS_CODES.OK).json(posts);
    },

    async getPost(req: TGetPostRequest, res: TGetPostResponse) {
        const post = await postsQueryRepository.getPost(req.params.id);
        if (!post) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(post);
    },

    async getPostComments(
        req: TGetAllPostCommentsRequest,
        res: TGetAllPostCommentsResponse
    ) {
        const searchQueries = getSearchQueries<
            CommentsDBSearchParams['sortBy']
        >(req.query);
        const id = req.params.id;
        const postComments = await commentsQueryRepository.getPostComments({
            searchQueries,
            postId: id,
        });
        if (!postComments) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(postComments);
    },

    async createNewPost(
        req: TCreateNewPostRequest,
        res: TCreateNewPostResponse
    ) {
        const { title, shortDescription, content, blogId } = req.body;
        const post = await postsService.createNewPost({
            title,
            shortDescription,
            content,
            blogId,
        });
        if (!post) {
            res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST);
            return;
        }
        const createdPost = await postsQueryRepository.getPost(post);
        if (!createdPost) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.CREATED).json(createdPost);
    },

    async createNewCommentForPost(
        req: TCreateNewPostCommentRequest,
        res: TCreateNewPostCommentResponse
    ) {
        const { content } = req.body;
        const id = req.params.id;
        const commentId = await commentsService.createNewCommentForPost({
            content,
            id,
            userId: req.userId!,
        });
        if (!commentId) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        const createdComment =
            await commentsQueryRepository.getComment(commentId);
        if (!createdComment) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.CREATED).json(createdComment);
    },

    async updatePost(req: TUpdatePostRequest, res: Response) {
        const { title, shortDescription, content, blogId } = req.body;
        const id = req.params.id;
        const isPostUpdated = await postsService.updatePost({
            title,
            shortDescription,
            content,
            blogId,
            id,
        });
        res.sendStatus(
            isPostUpdated
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },

    async deletePost(req: TDeletePostRequest, res: Response) {
        const isPostDeleted = await postsService.deletePost(req.params.id);
        res.sendStatus(
            isPostDeleted
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },
};
