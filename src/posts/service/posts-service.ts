import {
    PostViewModel,
    TCreateNewPostRequest,
    TDeletePostRequest,
    TUpdatePostRequest,
} from '../types';
import { postsRepository } from '../repository';
import { blogsRepository, TCreateNewBlogPostRequest } from '../../blogs';
import { ObjectId } from 'mongodb';
import { PostDBModel } from '../model';

export const postsService = {
    async createNewPost(req: TCreateNewPostRequest) {
        const { title, shortDescription, content, blogId } = req.body;
        const blog = await blogsRepository.findBlogById(
            new ObjectId(req.body.blogId)
        );
        if (!blog) {
            return undefined;
        }
        const newPost: PostDBModel = {
            blogId,
            title,
            shortDescription,
            content,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        };
        const newPostId = await postsRepository.addNewPost(newPost);
        const createdPost = await postsRepository.findPostById(
            new ObjectId(newPostId)
        );
        if (!createdPost) {
            return undefined;
        }
        const addedPost: PostViewModel = {
            id: createdPost._id.toString(),
            title: createdPost.title,
            shortDescription: createdPost.shortDescription,
            content: createdPost.content,
            blogId: createdPost.blogId,
            blogName: createdPost.blogName,
            createdAt: createdPost.createdAt,
        };
        return addedPost;
    },

    async createNewPostForBlog(req: TCreateNewBlogPostRequest) {
        const blog = await blogsRepository.findBlogById(
            new ObjectId(req.params.id)
        );
        if (!blog) {
            return undefined;
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
