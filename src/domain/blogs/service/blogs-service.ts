import { ObjectId } from 'mongodb';
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
    }: BlogCreateRequestModel): Promise<TResult<string>> {
        const newBlog: BlogDBModel = {
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        };
        const createdBlogId = await blogsRepository.addNewBlog(newBlog)

        if (!createdBlogId) {
            return {
                status: 'InternalError',
                errorsMessages: [createResponseError('The error occurred during creation')]
            }
        }

        return {
            status: 'Success',
            data: createdBlogId
        }
    },

    async updateBlog({
        name,
        description,
        websiteUrl,
        id,
    }: Partial<BlogViewModel>): Promise<TResult> {
        const isBlogUpdated = await blogsRepository.updateBlog({
            name,
            description,
            websiteUrl,
            _id: new ObjectId(id),
        });
        if (!isBlogUpdated) {
            return {
                status: 'NotFound',
                errorsMessages: [createResponseError('Blog is not found')]
            }
        }
        return {
            status: 'Success',
            data: null
        };
    },

    async deleteBlog(id: string): Promise<TResult> {
        const isBlogDeleted = await blogsRepository.deleteBlog(
            new ObjectId(id)
        );
        if (!isBlogDeleted) {
            return {
                status: 'NotFound',
                errorsMessages: [createResponseError('Blog is not found')]
            }
        }
        return {
            status: 'Success',
            data: null
        };;
    },
};
