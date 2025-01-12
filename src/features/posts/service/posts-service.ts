import { PostCreateRequestModel } from '../types';
import { PostsRepository } from '../repository';
import { PostDBModel } from '../model';
import { TResult } from '../../../shared/types';
import {
    internalErrorResult,
    notFoundErrorResult,
    successResult,
} from '../../../shared/helpers';
import { BlogsRepository } from '../../blogs/repository';

export class PostsService {
    constructor(
        protected postsRepository: PostsRepository,
        protected blogsRepository: BlogsRepository
    ) {}

    async createNewPost({
        title,
        shortDescription,
        content,
        blogId,
    }: PostCreateRequestModel): Promise<TResult<{ id: string }>> {
        const blog = await this.blogsRepository.findBlogById(blogId);
        if (!blog) {
            return notFoundErrorResult('Blog is not found');
        }
        const newPost: PostDBModel = {
            blogId,
            title,
            shortDescription,
            content,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        };
        const createdPostId = await this.postsRepository.addNewPost(newPost);
        if (!createdPostId) {
            return internalErrorResult('Error occurred during creation');
        }
        return successResult({ id: createdPostId });
    }

    async createNewPostForBlog({
        title,
        shortDescription,
        content,
        id,
    }: Omit<PostCreateRequestModel, 'blogId'> & { id: string }): Promise<
        TResult<{ postId: string }>
    > {
        const blog = await this.blogsRepository.findBlogById(id);
        if (!blog) {
            return notFoundErrorResult('Blog is not found');
        }
        const newPost: PostDBModel = {
            title,
            shortDescription,
            content,
            blogId: blog._id.toString(),
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        };
        const createdPostId = await this.postsRepository.addNewPost(newPost);
        if (!createdPostId) {
            return notFoundErrorResult('Post is not found');
        }
        return successResult({ postId: createdPostId });
    }

    async updatePost(
        id: string,
        title: PostCreateRequestModel['title'],
        shortDescription: PostCreateRequestModel['shortDescription'],
        content: PostCreateRequestModel['content'],
        blogId: PostCreateRequestModel['blogId']
    ): Promise<TResult> {
        const isPostUpdated = await this.postsRepository.updatePost({
            id,
            title,
            shortDescription,
            content,
            blogId,
        });
        if (!isPostUpdated) {
            return notFoundErrorResult('Post is not found');
        }
        return successResult(null);
    }

    async deletePost(id: string): Promise<TResult> {
        const isPostDeleted = await this.postsRepository.deletePost(id);
        if (!isPostDeleted) {
            return notFoundErrorResult('Post is not found');
        }
        return successResult(null);
    }
}
