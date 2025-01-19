import { inject, injectable } from 'inversify';
import {
    internalErrorResult,
    notFoundErrorResult,
    successResult,
} from '../../shared/helpers';
import { TResult } from '../../shared/types';
import { BlogsRepository } from './blogs-repository';
import { BlogCreateRequestModel, BlogViewModel } from './types';
import { BlogDBModel } from './blogs-model';

@injectable()
export class BlogsService {
    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository
    ) {}

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
        const createdBlogId = await this.blogsRepository.addNewBlog(newBlog);

        if (!createdBlogId) {
            return internalErrorResult('The error occurred during creation');
        }

        return successResult({ blogId: createdBlogId });
    }

    async updateBlog({
        id,
        name,
        description,
        websiteUrl,
    }: Partial<BlogViewModel>): Promise<TResult> {
        const isBlogUpdated = await this.blogsRepository.updateBlog({
            id,
            name,
            description,
            websiteUrl,
        });
        if (!isBlogUpdated) {
            return notFoundErrorResult('Blog is not found');
        }
        return successResult(null);
    }

    async deleteBlog(id: string): Promise<TResult> {
        const isBlogDeleted = await this.blogsRepository.deleteBlog(id);
        if (!isBlogDeleted) {
            return notFoundErrorResult('Blog is not found');
        }
        return successResult(null);
    }
}
