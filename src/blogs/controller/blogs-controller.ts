import { Response } from 'express';
import { blogsRepository, blogsQueryRepository } from '../repository';
import { HTTP_STATUS_CODES } from '../../constants';
import { BlogViewModel, TCreateNewBlogPostRequest, TCreateNewBlogPostResponse, TCreateNewBlogRequest, TCreateNewBlogResponse, TDeleteBlogRequest, TGetAllBlogPostsRequest, TGetAllBlogPostsResponse, TGetAllBlogsRequest, TGetAllBlogsResponse, TGetBlogRequest, TGetBlogResponse, TUpdateBlogRequest } from '../types';
import { blogsService } from '../service';
import { BlogDBModel } from '../model/blogs-model';
import { ObjectId } from 'mongodb';

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

    async createNewBlog(req: TCreateNewBlogRequest, res: TCreateNewBlogResponse) {
        const {name, description, websiteUrl} = req.body;
        const newBlog: BlogDBModel = {
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const newBlogId = await blogsRepository.addNewBlog(newBlog);
        const createdBlog = await blogsRepository.findBlogById(new ObjectId(newBlogId));
        if (!createdBlog) {
            return undefined
        }
        const addedBlog: BlogViewModel = {
            id: createdBlog._id.toString(),
            name: createdBlog.name, 
            description: createdBlog.description,
            websiteUrl: createdBlog.websiteUrl,
            createdAt: createdBlog.createdAt,
            isMembership: createdBlog.isMembership
        }
        res.status(HTTP_STATUS_CODES.CREATED).json(addedBlog);
    },

    async updateBlog(req: TUpdateBlogRequest, res: Response) {
        const {name, description, websiteUrl} = req.body
        const isBlogUpdated = await blogsRepository.updateBlog({
            name,
            description,
            websiteUrl,
            _id: new ObjectId(req.params.id),
        });
        res.sendStatus(
            isBlogUpdated
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },

    async deleteBlog(req: TDeleteBlogRequest, res: Response) {
        const isBlogDeleted = await blogsRepository.deleteBlog(new ObjectId(req.params.id));
        res.sendStatus(
            isBlogDeleted
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },


//TODO: check from where to fetch posts
    async getBlogPosts(
        req: TGetAllBlogPostsRequest,
        res: TGetAllBlogPostsResponse
    ) {
        const posts = await blogsService.getBlogPosts(req);
        if (!posts) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(posts);
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
};
