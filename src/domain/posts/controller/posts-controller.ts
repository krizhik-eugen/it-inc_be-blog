import { HTTP_STATUS_CODES } from '../../../constants';
import {
    TCreateNewPostCommentRequest,
    TCreateNewPostCommentResponse,
    TCreateNewPostRequest,
    TCreateNewPostResponse,
    TDeletePostRequest,
    TDeletePostResponse,
    TGetAllPostCommentsRequest,
    TGetAllPostCommentsResponse,
    TGetAllPostsRequest,
    TGetAllPostsResponse,
    TGetPostRequest,
    TGetPostResponse,
    TUpdatePostRequest,
    TUpdatePostResponse,
} from '../types';
import { postsService } from '../service';
import { postsQueryRepository } from '../repository';
import {
    CommentsDBSearchParams,
    commentsQueryRepository,
    commentsService,
} from '../../comments';
import { PostsDBSearchParams } from '../model';
import { createResponseError, getSearchQueries } from '../../../shared/helpers';

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
            res.status(HTTP_STATUS_CODES.NOT_FOUND).send({
                errorsMessages: [createResponseError('Post is not found')],
            });
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
            res.status(HTTP_STATUS_CODES.NOT_FOUND).send({
                errorsMessages: [createResponseError('Post is not found')],
            });
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(postComments);
    },

    async createNewPost(
        req: TCreateNewPostRequest,
        res: TCreateNewPostResponse
    ) {
        const { title, shortDescription, content, blogId } = req.body;
        const result = await postsService.createNewPost({
            title,
            shortDescription,
            content,
            blogId,
        });
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({
                errorsMessages: [createResponseError('Post is not created')],
            });
            return;
        }
        const createdPost = await postsQueryRepository.getPost(result.data.id);
        if (!createdPost) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).send({
                errorsMessages: [createResponseError('Post is not found')],
            });
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
        const result = await commentsService.createNewCommentForPost(
            content,
            id,
            req.userId!
        );
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).send({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        const createdComment = await commentsQueryRepository.getComment(
            result.data.id
        );
        if (!createdComment) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).send({
                errorsMessages: [createResponseError('Comment is not found')],
            });
            return;
        }
        res.status(HTTP_STATUS_CODES.CREATED).json(createdComment);
    },

    async updatePost(req: TUpdatePostRequest, res: TUpdatePostResponse) {
        const { title, shortDescription, content, blogId } = req.body;
        const id = req.params.id;
        const result = await postsService.updatePost(
            title,
            shortDescription,
            content,
            blogId,
            id
        );
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).send({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    },

    async deletePost(req: TDeletePostRequest, res: TDeletePostResponse) {
        const result = await postsService.deletePost(req.params.id);
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).send({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    },
};
