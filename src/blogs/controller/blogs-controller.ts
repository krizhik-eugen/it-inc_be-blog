import { Response } from 'express';
import { blogsQueryRepository } from '../repository';
import { HTTP_STATUS_CODES } from '../../constants';
import { TCreateNewBlogPostRequest, TCreateNewBlogPostResponse, TCreateNewBlogRequest, TCreateNewBlogResponse, TDeleteBlogRequest, TGetAllBlogPostsRequest, TGetAllBlogPostsResponse, TGetAllBlogsRequest, TGetAllBlogsResponse, TGetBlogRequest, TGetBlogResponse, TUpdateBlogRequest } from '../types';
import { blogsService } from '../service';
import { postsQueryRepository } from '../../posts';

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
        const posts = await postsQueryRepository.getBlogPosts(req);
        if (!posts) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(posts);
    },

    async createNewBlog(req: TCreateNewBlogRequest, res: TCreateNewBlogResponse) {
        const createdBlog = await blogsService.createNewBlog(req);
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
        const createdPost = await blogsService.createNewPostForBlog(req);
        if (!createdPost) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.CREATED).json(createdPost);
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
