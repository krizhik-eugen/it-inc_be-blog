import { Response } from 'express';
import { blogsRepository } from '../repository';
import { HTTP_STATUS_CODES } from '../../constants';
import {
    TBlog,
    TBlogPostsRequest,
    TBlogSearchParams,
    TCreateUpdateBlogRequest,
    TGetBlogsResponse,
    TGetDeleteDBInstanceRequest,
} from '../types';
import { blogsService } from '../service';
import { TCreateUpdatePostRequest, TPost } from '../../posts';

export const blogsController = {
    async getBlogs(req: TBlogSearchParams, res: Response<TGetBlogsResponse>) {
        const blogs = await blogsService.getBlogs(req);
        res.status(HTTP_STATUS_CODES.OK).json(blogs);
    },

    async getBlogPosts(
        req: TBlogPostsRequest,
        res: Response<TGetBlogsResponse>
    ) {
        const posts = await blogsService.getBlogPosts(req);
        if (!posts) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(posts);
    },

    async createNewBlog(req: TCreateUpdateBlogRequest, res: Response<TBlog>) {
        const createdBlog = await blogsRepository.addNewBlog({
            ...req.body,
        });
        res.status(HTTP_STATUS_CODES.CREATED).json(createdBlog);
    },

    async createNewPostForBlog(req: Omit<TCreateUpdatePostRequest, 'blogId'>, res: Response<TPost>) {
        const createdPost = await blogsService.createNewPostForBlog(req);
        if (!createdPost) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.CREATED).json(createdPost);
    },

    async getBlog(req: TGetDeleteDBInstanceRequest, res: Response<TBlog>) {
        console.log('getBlog');
        const foundBlog = await blogsRepository.getBlog(req.params.id);

        if (!foundBlog) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(foundBlog);
    },

    async updateBlog(req: TCreateUpdateBlogRequest, res: Response) {
        const isBlogUpdated = await blogsRepository.updateBlog({
            ...req.body,
            id: req.params.id,
        });
        res.sendStatus(
            isBlogUpdated
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },

    async deleteBlog(req: TGetDeleteDBInstanceRequest, res: Response) {
        const isBlogDeleted = await blogsRepository.deleteBlog(req.params.id);
        res.sendStatus(
            isBlogDeleted
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },
};
