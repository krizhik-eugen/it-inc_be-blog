import { PostCreateRequestModel } from '../types';
import { postsRepository } from '../repository';
import { blogsRepository } from '../../../features/blogs';
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
    }: PostCreateRequestModel): Promise<TResult<{ id: string }>> {
        const blog = await blogsRepository.findBlogById(new ObjectId(blogId));
        if (!blog) {
            return {
                status: 'NotFound',
                errorsMessages: [createResponseError('Blog is not found')],
            };
        }
        const newPost: PostDBModel = {
            blogId,
            title,
            shortDescription,
            content,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        };
        const createdPostId = await postsRepository.addNewPost(newPost);
        if (!createdPostId) {
            return {
                status: 'InternalError',
                errorsMessages: [
                    createResponseError('Error occurred during creation'),
                ],
            };
        }
        return {
            status: 'Success',
            data: { id: createdPostId },
        };
    },

    async createNewPostForBlog({
        title,
        shortDescription,
        content,
        id,
    }: Omit<PostCreateRequestModel, 'blogId'> & { id: string }): Promise<
        TResult<{ postId: string }>
    > {
        const blog = await blogsRepository.findBlogById(new ObjectId(id));
        if (!blog) {
            return {
                status: 'NotFound',
                errorsMessages: [createResponseError('Blog is not found')],
            };
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
                errorsMessages: [createResponseError('Post is not found')],
            };
        }
        return {
            status: 'Success',
            data: { postId: createdPostId },
        };
    },

    async updatePost(
        title: PostCreateRequestModel['title'],
        shortDescription: PostCreateRequestModel['shortDescription'],
        content: PostCreateRequestModel['content'],
        blogId: PostCreateRequestModel['blogId'],
        id: string
    ): Promise<TResult> {
        const isPostUpdated = await postsRepository.updatePost({
            _id: new ObjectId(id),
            title,
            shortDescription,
            content,
            blogId,
        });
        if (!isPostUpdated) {
            return {
                status: 'NotFound',
                errorsMessages: [createResponseError('Post is not found')],
            };
        }
        return {
            status: 'Success',
            data: null,
        };
    },

    async deletePost(id: string): Promise<TResult> {
        const isPostDeleted = await postsRepository.deletePost(
            new ObjectId(id)
        );
        if (!isPostDeleted) {
            return {
                status: 'NotFound',
                errorsMessages: [createResponseError('Post is not found')],
            };
        }
        return {
            status: 'Success',
            data: null,
        };
    },
};
