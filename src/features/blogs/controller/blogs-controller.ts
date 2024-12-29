import { blogsQueryRepository } from '../repository';
import { HTTP_STATUS_CODES } from '../../../constants';
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
import { createResponseError, getSearchQueries } from '../../../shared/helpers';
import { BlogsDBSearchParams } from '../model';
import { TResponseWithError } from '../../../shared/types';

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
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: [createResponseError('Blog is not found')],
            });
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
        const posts = await postsQueryRepository.getBlogPosts({
            searchQueries,
            blogId: id,
        });
        if (!posts) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: [createResponseError('Blog is not found')],
            });
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(posts);
    },

    async createNewBlog(
        req: TCreateNewBlogRequest,
        res: TCreateNewBlogResponse
    ) {
        const { name, description, websiteUrl } = req.body;
        const result = await blogsService.createNewBlog({
            name,
            description,
            websiteUrl,
        });
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        const createdBlog = await blogsQueryRepository.getBlog(
            result.data.blogId
        );
        if (!createdBlog) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: [createResponseError('Blog is not found')],
            });
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
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        const addedPost = await postsQueryRepository.getPost(
            result.data.postId
        );
        if (!addedPost) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: [createResponseError('Post is not found')],
            });
            return;
        }
        res.status(HTTP_STATUS_CODES.CREATED).json(addedPost);
    },

    async updateBlog(req: TUpdateBlogRequest, res: TResponseWithError) {
        const { name, description, websiteUrl } = req.body;
        const id = req.params.id;
        const result = await blogsService.updateBlog({
            name,
            description,
            websiteUrl,
            id,
        });
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    },

    async deleteBlog(req: TDeleteBlogRequest, res: TResponseWithError) {
        const result = await blogsService.deleteBlog(req.params.id);
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    },
};
