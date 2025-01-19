import { inject, injectable } from 'inversify';
import { PostsQueryRepository } from '../infrastructure/posts-query-repository';
import { PostsService } from '../application/posts-service';
import { CommentsQueryRepository } from '../../comments/comments-query-repository';
import { CommentsService } from '../../comments/comments-service';
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
} from './types';
import { createResponseError, getSearchQueries } from '../../../shared/helpers';
import { HTTP_STATUS_CODES } from '../../../constants';
import { CommentsDBSearchParams } from '../../comments/comments-model';
import { TResponseWithError } from '../../../shared/types';
import { TUpdateLikeStatusRequest } from '../../likes/api/types';
import { PostsDBSearchParams } from '../domain/types';

@injectable()
export class PostsController {
    constructor(
        @inject(PostsQueryRepository)
        protected postsQueryRepository: PostsQueryRepository,
        @inject(PostsService) protected postsService: PostsService,
        @inject(CommentsQueryRepository)
        protected commentsQueryRepository: CommentsQueryRepository,
        @inject(CommentsService) protected commentsService: CommentsService
    ) {}

    async getAllPosts(req: TGetAllPostsRequest, res: TGetAllPostsResponse) {
        const userId = req.userId;
        const searchQueries = getSearchQueries<PostsDBSearchParams['sortBy']>(
            req.query
        );
        const posts = await this.postsQueryRepository.getPosts({
            searchQueries,
            userId,
        });
        res.status(HTTP_STATUS_CODES.OK).json(posts);
    }

    async getPost(req: TGetPostRequest, res: TGetPostResponse) {
        const userId = req.userId;
        const post = await this.postsQueryRepository.getPost(
            req.params.id,
            userId
        );
        if (!post) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: [createResponseError('Post is not found')],
            });
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(post);
    }

    async getPostComments(
        req: TGetAllPostCommentsRequest,
        res: TGetAllPostCommentsResponse
    ) {
        const searchQueries = getSearchQueries<
            CommentsDBSearchParams['sortBy']
        >(req.query);
        const id = req.params.id;
        const userId = req.userId;
        const postComments = await this.commentsQueryRepository.getPostComments(
            {
                searchQueries,
                postId: id,
                userId,
            }
        );
        if (!postComments) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: [createResponseError('Post is not found')],
            });
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(postComments);
    }

    async createNewPost(
        req: TCreateNewPostRequest,
        res: TCreateNewPostResponse
    ) {
        const userId = req.userId;
        const { title, shortDescription, content, blogId } = req.body;
        const result = await this.postsService.createNewPost({
            title,
            shortDescription,
            content,
            blogId,
        });
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                errorsMessages: [createResponseError('Post is not created')],
            });
            return;
        }
        const createdPost = await this.postsQueryRepository.getPost(
            result.data.id,
            userId
        );
        if (!createdPost) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: [createResponseError('Post is not found')],
            });
            return;
        }
        res.status(HTTP_STATUS_CODES.CREATED).json(createdPost);
    }

    async createNewCommentForPost(
        req: TCreateNewPostCommentRequest,
        res: TCreateNewPostCommentResponse
    ) {
        const { content } = req.body;
        const id = req.params.id;
        const result = await this.commentsService.createNewCommentForPost(
            content,
            id,
            req.userId!
        );
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        const createdComment = await this.commentsQueryRepository.getComment(
            result.data.id,
            req.userId
        );
        if (!createdComment) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: [createResponseError('Comment is not found')],
            });
            return;
        }
        res.status(HTTP_STATUS_CODES.CREATED).json(createdComment);
    }

    async updatePost(req: TUpdatePostRequest, res: TResponseWithError) {
        const { title, shortDescription, content } = req.body;
        const id = req.params.id;
        const result = await this.postsService.updatePost(
            id,
            title,
            shortDescription,
            content
        );
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    }

    async updatePostLikeStatus(
        req: TUpdateLikeStatusRequest,
        res: TResponseWithError
    ) {
        const postId = req.params.id;
        const userId = req.userId!;
        const { likeStatus } = req.body;

        const result = await this.postsService.updatePostLikeStatus(
            likeStatus,
            postId,
            userId
        );
        if (result.status === 'Forbidden') {
            res.status(HTTP_STATUS_CODES.FORBIDDEN).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        if (result.status === 'NotFound') {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    }

    async deletePostById(req: TDeletePostRequest, res: TResponseWithError) {
        const result = await this.postsService.deletePostById(req.params.id);
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    }
}
