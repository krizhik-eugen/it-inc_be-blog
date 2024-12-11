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
import {
    PostsDBSearchParams,
    postsQueryRepository,
    postsService,
} from '../../posts';
import { getSearchQueries } from '../../helpers';
import { BlogsDBSearchParams } from '../model';

export const blogsController = {
    async getBlogs(req: TGetAllBlogsRequest, res: TGetAllBlogsResponse) {
        const { searchNameTerm, ...restQueries } = req.query;
        const searchQueries =
            getSearchQueries<BlogsDBSearchParams['sortBy']>(restQueries);

        const blogs = await blogsQueryRepository.getBlogs({
            searchQueries,
            term: searchNameTerm,
        });
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
        const id = req.params.id;
        const searchQueries = getSearchQueries<PostsDBSearchParams['sortBy']>(
            req.query
        );
        const result = await postsQueryRepository.getBlogPosts({
            searchQueries,
            blogId: id,
        });
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
        const { name, description, websiteUrl } = req.body;
        const createdBlogId = await blogsService.createNewBlog({
            name,
            description,
            websiteUrl,
        });
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
        const { title, shortDescription, content } = req.body;
        const id = req.params.id;
        const result = await postsService.createNewPostForBlog({
            title,
            shortDescription,
            content,
            id,
        });
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
        const { name, description, websiteUrl } = req.body;
        const id = req.params.id;
        const isBlogUpdated = await blogsService.updateBlog({
            name,
            description,
            websiteUrl,
            id,
        });
        res.sendStatus(
            isBlogUpdated
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },

    async deleteBlog(req: TDeleteBlogRequest, res: Response) {
        const isBlogDeleted = await blogsService.deleteBlog(req.params.id);
        res.sendStatus(
            isBlogDeleted
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },
};
