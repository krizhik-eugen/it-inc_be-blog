import { blogsRepository } from '../repository';
import { BlogCreateRequestModel, BlogViewModel } from '../types';
import { BlogDBModel } from '../model';
import { TResult } from '../../../shared/types';
import { createResponseError } from '../../../shared/helpers';

export const blogsService = {
    async createNewBlog({
        name,
        description,
        websiteUrl,
    }: BlogCreateRequestModel): Promise<TResult<{ blogId: string }>> {
        const newBlog: BlogDBModel = {
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        };
        const createdBlogId = await blogsRepository.addNewBlog(newBlog);

        if (!createdBlogId) {
            return {
                status: 'InternalError',
                errorsMessages: [
                    createResponseError('The error occurred during creation'),
                ],
            };
        }

        return {
            status: 'Success',
            data: { blogId: createdBlogId },
        };
    },

    async updateBlog({
        id,
        name,
        description,
        websiteUrl,
    }: Partial<BlogViewModel>): Promise<TResult> {
        const isBlogUpdated = await blogsRepository.updateBlog({
            id,
            name,
            description,
            websiteUrl,
        });
        if (!isBlogUpdated) {
            return {
                status: 'NotFound',
                errorsMessages: [createResponseError('Blog is not found')],
            };
        }
        return {
            status: 'Success',
            data: null,
        };
    },

    async deleteBlog(id: string): Promise<TResult> {
        const isBlogDeleted = await blogsRepository.deleteBlog(id);
        if (!isBlogDeleted) {
            return {
                status: 'NotFound',
                errorsMessages: [createResponseError('Blog is not found')],
            };
        }
        return {
            status: 'Success',
            data: null,
        };
    },
};
