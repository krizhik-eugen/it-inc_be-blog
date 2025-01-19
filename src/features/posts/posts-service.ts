import { inject, injectable } from 'inversify';
import { PostsRepository } from './posts-repository';
import { LikesRepository } from '../likes/likes-repository';
import { BlogsRepository } from '../blogs/blogs-repository';
import { TResult } from '../../shared/types';
import {
    internalErrorResult,
    notFoundErrorResult,
    successResult,
} from '../../shared/helpers';
import { PostDBModel } from './posts-model';
import { TLikeStatus } from '../likes/types';
import { PostCreateRequestModel } from './types';

@injectable()
export class PostsService {
    constructor(
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
        @inject(LikesRepository) protected likesRepository: LikesRepository
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
            likesCount: 0,
            dislikesCount: 0,
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
            likesCount: 0,
            dislikesCount: 0,
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

    async updatePostLikeStatus(
        likeStatus: TLikeStatus,
        id: string,
        userId: string
    ): Promise<TResult> {
        const post = await this.postsRepository.findPostById(id);
        if (!post) {
            return notFoundErrorResult('Comment is not found');
        }
        const foundLike =
            await this.likesRepository.findLikeByUserIdAndParentId(userId, id);
        if (!foundLike) {
            await this.likesRepository.addLike({
                userId,
                parentId: id,
                status: likeStatus,
                createdAt: new Date().toISOString(),
            });
        }
        if (foundLike) {
            await this.likesRepository.updateLikeStatus({
                userId,
                parentId: id,
                status: likeStatus,
            });
        }
        const likesCount =
            await this.likesRepository.getLikesCountByParentId(id);
        const dislikesCount =
            await this.likesRepository.getDislikesCountByParentId(id);
        await this.postsRepository.updatePost({
            id,
            likesCount,
            dislikesCount,
        });
        return successResult(null);
    }

    async deletePost(id: string): Promise<TResult> {
        const isPostDeleted = await this.postsRepository.deletePost(id);
        if (!isPostDeleted) {
            return notFoundErrorResult('Post is not found');
        }
        await this.likesRepository.deleteLikesByParentId(id);
        return successResult(null);
    }
}
