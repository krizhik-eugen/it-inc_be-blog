import { ObjectId } from 'mongodb';
import { blogsRepository } from '../repository';
import {
    TCreateNewBlogRequest,
    TDeleteBlogRequest,
    TUpdateBlogRequest,
} from '../types';
import { BlogDBModel } from '../model';

export const blogsService = {
    async createNewBlog(req: TCreateNewBlogRequest) {
        const { name, description, websiteUrl } = req.body;
        const newBlog: BlogDBModel = {
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        };
        return await blogsRepository.addNewBlog(newBlog);
    },

    async updateBlog(req: TUpdateBlogRequest) {
        const { name, description, websiteUrl } = req.body;
        const isBlogUpdated = await blogsRepository.updateBlog({
            name,
            description,
            websiteUrl,
            _id: new ObjectId(req.params.id),
        });
        return isBlogUpdated;
    },

    async deleteBlog(req: TDeleteBlogRequest) {
        const isBlogDeleted = await blogsRepository.deleteBlog(
            new ObjectId(req.params.id)
        );
        return isBlogDeleted;
    },
};
