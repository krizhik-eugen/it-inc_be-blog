import { BlogsQueryRepository } from '../repository';
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
import { BlogsService } from '../service';
import { PostsDBSearchParams } from '../../posts/model';
import { PostsService } from '../../posts/service';
import { PostsQueryRepository } from '../../posts/repository';
import { createResponseError, getSearchQueries } from '../../../shared/helpers';
import { BlogsDBSearchParams } from '../model';
import { TResponseWithError } from '../../../shared/types';

export class BlogsController {
    constructor(
        protected blogsQueryRepository: BlogsQueryRepository,
        protected blogsService: BlogsService,
        protected postsQueryRepository: PostsQueryRepository,
        protected postsService: PostsService
    ) {}

    async getBlogs(req: TGetAllBlogsRequest, res: TGetAllBlogsResponse) {
        const { searchNameTerm, ...restQueries } = req.query;
        const searchQueries =
            getSearchQueries<BlogsDBSearchParams['sortBy']>(restQueries);

        const blogs = await this.blogsQueryRepository.getBlogs({
            searchQueries,
            term: searchNameTerm,
        });
        res.status(HTTP_STATUS_CODES.OK).json(blogs);
    }

    async getBlog(req: TGetBlogRequest, res: TGetBlogResponse) {
        const foundBlog = await this.blogsQueryRepository.getBlog(
            req.params.id
        );
        if (!foundBlog) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: [createResponseError('Blog is not found')],
            });
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(foundBlog);
    }

    async getBlogPosts(
        req: TGetAllBlogPostsRequest,
        res: TGetAllBlogPostsResponse
    ) {
        const userId = req.userId;
        const id = req.params.id;
        const searchQueries = getSearchQueries<PostsDBSearchParams['sortBy']>(
            req.query
        );
        const posts = await this.postsQueryRepository.getBlogPosts({
            searchQueries,
            blogId: id,
            userId,
        });
        if (!posts) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: [createResponseError('Blog is not found')],
            });
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(posts);
    }

    async createNewBlog(
        req: TCreateNewBlogRequest,
        res: TCreateNewBlogResponse
    ) {
        const { name, description, websiteUrl } = req.body;
        const result = await this.blogsService.createNewBlog({
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
        const createdBlog = await this.blogsQueryRepository.getBlog(
            result.data.blogId
        );
        if (!createdBlog) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: [createResponseError('Blog is not found')],
            });
            return;
        }
        res.status(HTTP_STATUS_CODES.CREATED).json(createdBlog);
    }

    async createNewPostForBlog(
        req: TCreateNewBlogPostRequest,
        res: TCreateNewBlogPostResponse
    ) {
        const { title, shortDescription, content } = req.body;
        const id = req.params.id;
        const userId = req.userId;
        const result = await this.postsService.createNewPostForBlog({
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
        const addedPost = await this.postsQueryRepository.getPost(
            result.data.postId,
            userId
        );
        if (!addedPost) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: [createResponseError('Post is not found')],
            });
            return;
        }
        res.status(HTTP_STATUS_CODES.CREATED).json(addedPost);
    }

    async updateBlog(req: TUpdateBlogRequest, res: TResponseWithError) {
        const { name, description, websiteUrl } = req.body;
        const id = req.params.id;
        const result = await this.blogsService.updateBlog({
            id,
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
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    }

    async deleteBlog(req: TDeleteBlogRequest, res: TResponseWithError) {
        const result = await this.blogsService.deleteBlog(req.params.id);
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    }
}
