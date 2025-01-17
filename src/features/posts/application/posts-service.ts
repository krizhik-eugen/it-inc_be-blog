import { inject, injectable } from 'inversify';
import { PostsRepository } from '../infrastructure/posts-repository';
import { LikesRepository } from '../../likes/infrastructure/likes-repository';
import { BlogsRepository } from '../../blogs/infrastructure/blogs-repository';
import { TResult } from '../../../shared/types';
import { notFoundErrorResult, successResult } from '../../../shared/helpers';
import { PostModel } from '../domain/post-entity';
import { PostCreateRequestModel } from '../api/types';
import { LikeModel } from '../../likes/domain/like-entity';
import { TLikeStatus } from '../../likes/domain/types';

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

        const newPost = PostModel.createNewPost({
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog.name,
        });

        const createdPost = await this.postsRepository.save(newPost);

        return successResult({ id: createdPost.id });
    }

    async updatePost(
        id: string,
        title: PostCreateRequestModel['title'],
        shortDescription: PostCreateRequestModel['shortDescription'],
        content: PostCreateRequestModel['content']
    ): Promise<TResult> {
        const foundPost = await this.postsRepository.findPostById(id);
        if (!foundPost) {
            return notFoundErrorResult('Post is not found');
        }

        foundPost.updatePost({ title, shortDescription, content });

        await this.postsRepository.save(foundPost);

        return successResult(null);
    }

    async updatePostLikeStatus(
        likeStatus: TLikeStatus,
        id: string,
        userId: string
    ): Promise<TResult> {
        const foundPost = await this.postsRepository.findPostById(id);
        if (!foundPost) {
            return notFoundErrorResult('Comment is not found');
        }

        const foundLike =
            await this.likesRepository.findLikeByUserIdAndParentId(userId, id);

        if (!foundLike) {
            const newLike = LikeModel.createNewLike({
                userId,
                parentId: id,
                status: likeStatus,
            });
            await this.likesRepository.save(newLike);
        }

        if (foundLike) {
            foundLike.updateStatus(likeStatus);
            await this.likesRepository.save(foundLike);
        }

        const [likesCount, dislikesCount] = await Promise.all([
            await this.likesRepository.getLikesCountByParentId(id),
            await this.likesRepository.getDislikesCountByParentId(id),
        ]);

        foundPost.likesCount = likesCount;
        foundPost.dislikesCount = dislikesCount;

        await this.postsRepository.save(foundPost);

        return successResult(null);
    }

    async deletePostById(id: string): Promise<TResult> {
        const isPostDeleted = await this.postsRepository.deletePostById(id);
        if (!isPostDeleted) {
            return notFoundErrorResult('Post is not found');
        }
        await this.likesRepository.deleteLikesByParentId(id);
        return successResult(null);
    }
}
