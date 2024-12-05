import { Response } from 'express';
import { blogsQueryRepository } from '../repository';
import { HTTP_STATUS_CODES } from '../../constants';
import {
    TCreateNewBlogPostRequest,
    TCreateNewBlogPostResponse,
    TCreateNewBlogRequest,
    TCreateNewBlogResponse,
    TDeleteBlogRequest,
    TGetAllBlogPostsRequest,
    TGetAllBlogPostsResponse,
    TGetAllBlogsRequest,
    TGetAllBlogsResponse,
    TGetBlogRequest,
    TGetBlogResponse,
    TUpdateBlogRequest,
} from '../types';
import { blogsService } from '../service';
import { postsQueryRepository, postsService } from '../../posts';

export const blogsController = {
    async getBlogs(req: TGetAllBlogsRequest, res: TGetAllBlogsResponse) {
        const blogs = await blogsQueryRepository.getBlogs(req);
        res.status(HTTP_STATUS_CODES.OK).json(blogs);
    },

    async getBlog(req: TGetBlogRequest, res: TGetBlogResponse) {
        const foundBlog = await blogsQueryRepository.getBlog(req.params.id);
        if (!foundBlog) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(foundBlog);
    },

    async getBlogPosts(
        req: TGetAllBlogPostsRequest,
        res: TGetAllBlogPostsResponse
    ) {
        const result = await postsQueryRepository.getBlogPosts(req);
        if ('errorsMessages' in result) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(result);
    },

    async createNewBlog(
        req: TCreateNewBlogRequest,
        res: TCreateNewBlogResponse
    ) {
        const createdBlogId = await blogsService.createNewBlog(req);
        if (!createdBlogId) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        const createdBlog = await blogsQueryRepository.getBlog(createdBlogId);
        if (!createdBlog) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.CREATED).json(createdBlog);
    },

    async createNewPostForBlog(
        req: TCreateNewBlogPostRequest,
        res: TCreateNewBlogPostResponse
    ) {
        const result = await postsService.createNewPostForBlog(req);
        if (typeof result !== 'string' && 'errorsMessages' in result) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json(result);
            return;
        }
        const addedPost = await postsQueryRepository.getPost(result);
        if (!addedPost) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.CREATED).json(addedPost);
    },

    async updateBlog(req: TUpdateBlogRequest, res: Response) {
        const isBlogUpdated = await blogsService.updateBlog(req);
        res.sendStatus(
            isBlogUpdated
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },

    async deleteBlog(req: TDeleteBlogRequest, res: Response) {
        const isBlogDeleted = await blogsService.deleteBlog(req);
        res.sendStatus(
            isBlogDeleted
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },
};
