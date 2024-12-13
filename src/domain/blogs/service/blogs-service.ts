import { ObjectId } from 'mongodb';
import { blogsRepository } from '../repository';
import { BlogCreateRequestModel, BlogViewModel } from '../types';
import { BlogDBModel } from '../model';

export const blogsService = {
    async createNewBlog({
        name,
        description,
        websiteUrl,
    }: BlogCreateRequestModel) {
        const newBlog: BlogDBModel = {
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        };
        return await blogsRepository.addNewBlog(newBlog);
    },

    async updateBlog({
        name,
        description,
        websiteUrl,
        id,
    }: Partial<BlogViewModel>) {
        const isBlogUpdated = await blogsRepository.updateBlog({
            name,
            description,
            websiteUrl,
            _id: new ObjectId(id),
        });
        return isBlogUpdated;
    },

    async deleteBlog(id: string) {
        const isBlogDeleted = await blogsRepository.deleteBlog(
            new ObjectId(id)
        );
        return isBlogDeleted;
    },
};
