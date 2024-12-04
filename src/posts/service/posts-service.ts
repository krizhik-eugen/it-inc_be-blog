import {
    TCreateNewPostRequest,
    TDeletePostRequest,
    TUpdatePostRequest,
} from '../types';
import { postsRepository } from '../repository';
import { blogsRepository, TCreateNewBlogPostRequest } from '../../blogs';
import { ObjectId } from 'mongodb';
import { PostDBModel } from '../model';
import { createResponseError } from '../../helpers';

export const postsService = {
    async createNewPost(req: TCreateNewPostRequest) {
        const { title, shortDescription, content, blogId } = req.body;
        const blog = await blogsRepository.findBlogById(new ObjectId(blogId));
        if (!blog) {
            return await Promise.resolve(
                createResponseError('Blog not found', 'blogId')
            );
        }
        const newPost: PostDBModel = {
            blogId,
            title,
            shortDescription,
            content,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        };
        return await postsRepository.addNewPost(newPost);
    },

    async createNewPostForBlog(req: TCreateNewBlogPostRequest) {
        const blog = await blogsRepository.findBlogById(
            new ObjectId(req.params.id)
        );
        if (!blog) {
            return await Promise.resolve(
                createResponseError('Blog not found', 'id')
            );
        }
        const newPost: PostDBModel = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: blog._id.toString(),
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        };
        return await postsRepository.addNewPost(newPost);
    },

    async updatePost(req: TUpdatePostRequest) {
        const isPostUpdated = await postsRepository.updatePost({
            _id: new ObjectId(req.params.id),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
        });
        return isPostUpdated;
    },

    async deletePost(req: TDeletePostRequest) {
        const isPostDeleted = await postsRepository.deletePost(
            new ObjectId(req.params.id)
        );
        return isPostDeleted;
    },
};
