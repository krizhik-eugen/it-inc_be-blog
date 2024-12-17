import { PostCreateRequestModel } from '../types';
import { postsRepository } from '../repository';
import { blogsRepository } from '../../../domain/blogs';
import { ObjectId } from 'mongodb';
import { PostDBModel } from '../model';
import { TResult } from '../../../shared/types';
import { createResponseError } from '../../../shared/helpers';

export const postsService = {
    async createNewPost({
        title,
        shortDescription,
        content,
        blogId,
    }: PostCreateRequestModel) {
        const blog = await blogsRepository.findBlogById(new ObjectId(blogId));
        if (!blog) {
            return;
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

    async createNewPostForBlog({
        title,
        shortDescription,
        content,
        id,
    }: Omit<PostCreateRequestModel, 'blogId'> & { id: string }): Promise<TResult<string>> {
        const blog = await blogsRepository.findBlogById(new ObjectId(id));
        if (!blog) {
            return {
                status: 'NotFound',
                errorsMessages: [createResponseError('Blog is not found')]
            }
        }
        const newPost: PostDBModel = {
            title,
            shortDescription,
            content,
            blogId: blog._id.toString(),
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        };
        const createdPostId = await postsRepository.addNewPost(newPost);
        if (!createdPostId) {
            return {
                status: 'NotFound',
                errorsMessages: [createResponseError('Post is not found')]
            }
        }
        return {
            status: 'Success',
            data: createdPostId
        };
    },

    async updatePost({
        title,
        shortDescription,
        content,
        blogId,
        id,
    }: PostCreateRequestModel & { id: string }) {
        const isPostUpdated = await postsRepository.updatePost({
            _id: new ObjectId(id),
            title,
            shortDescription,
            content,
            blogId,
        });
        return isPostUpdated;
    },

    async deletePost(id: string) {
        const isPostDeleted = await postsRepository.deletePost(
            new ObjectId(id)
        );
        return isPostDeleted;
    },
};
