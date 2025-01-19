import { inject, injectable } from 'inversify';
import { notFoundErrorResult, successResult } from '../../../shared/helpers';
import { TResult } from '../../../shared/types';
import { BlogsRepository } from '../infrastructure/blogs-repository';
import { BlogCreateRequestModel, BlogViewModel } from '../api/types';
import { BlogModel } from '../domain/blog-entity';

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
        const newBlog = BlogModel.createNewBlog({
            name,
            description,
            websiteUrl,
        });

        const createdBlog = await this.blogsRepository.save(newBlog);

        return successResult({ blogId: createdBlog.id });
    }

    async updateBlog({
        id,
        name,
        description,
        websiteUrl,
    }: Partial<BlogViewModel>): Promise<TResult> {
        const foundBlog = await this.blogsRepository.findBlogById(id!);
        if (!foundBlog) {
            return notFoundErrorResult('Blog is not found');
        }

        if (name) {
            foundBlog.name = name;
        }
        if (description) {
            foundBlog.description = description;
        }
        if (websiteUrl) {
            foundBlog.websiteUrl = websiteUrl;
        }

        await this.blogsRepository.save(foundBlog);

        return successResult(null);
    }

    async deleteBlogById(id: string): Promise<TResult> {
        const isBlogDeleted = await this.blogsRepository.deleteBlogById(id);
        if (!isBlogDeleted) {
            return notFoundErrorResult('Blog is not found');
        }
        return successResult(null);
    }
}
