import { inject, injectable } from 'inversify';
import { CommentsRepository } from '../infrastructure/comments-repository';
import { UsersRepository } from '../../users/infrastructure/users-repository';
import { PostsRepository } from '../../posts/infrastructure/posts-repository';
import { LikesRepository } from '../../likes/infrastructure/likes-repository';
import { CommentCreateRequestModel } from '../api/types';
import { TResult } from '../../../shared/types';
import {
    forbiddenErrorResult,
    notFoundErrorResult,
    successResult,
} from '../../../shared/helpers';
import { LikeModel } from '../../likes/domain/like-entity';
import { TLikeStatus } from '../../likes/domain/types';
import { CommentModel } from '../domain/comment-entity';

@injectable()
export class CommentsService {
    constructor(
        @inject(CommentsRepository)
        protected commentsRepository: CommentsRepository,
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(LikesRepository) protected likesRepository: LikesRepository
    ) {}

    async createNewCommentForPost(
        content: CommentCreateRequestModel['content'],
        id: string,
        userId: string
    ): Promise<TResult<{ id: string }>> {
        const postId = id;
        const foundPost = await this.postsRepository.findPostById(postId);
        if (!foundPost) {
            return notFoundErrorResult('Post is not found');
        }
        const foundUser = await this.usersRepository.findUserById(userId);

        const newComment = CommentModel.createNewComment({
            content,
            commentatorInfo: {
                userId,
                userLogin: foundUser!.accountData.login,
            },
            postId,
        });

        const createdComment = await this.commentsRepository.save(newComment);

        return successResult({ id: createdComment.id });
    }

    async updateComment(
        content: CommentCreateRequestModel['content'],
        id: string,
        userId: string
    ): Promise<TResult> {
        const comment = await this.commentsRepository.findCommentById(id);
        if (!comment) {
            return notFoundErrorResult('Comment is not found');
        }

        const result = comment.updateContent({ content, userId });
        if (result.error) {
            return forbiddenErrorResult(result.error);
        }

        await this.commentsRepository.save(comment);

        return successResult(null);
    }

    async updateCommentLikeStatus(
        likeStatus: TLikeStatus,
        id: string,
        userId: string
    ): Promise<TResult> {
        const foundComment = await this.commentsRepository.findCommentById(id);
        if (!foundComment) {
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

        foundComment.updateLikesCount({
            likesCount,
            dislikesCount,
        });

        await this.commentsRepository.save(foundComment);

        return successResult(null);
    }

    async deleteCommentById(id: string, userId: string): Promise<TResult> {
        const foundComment = await this.commentsRepository.findCommentById(id);
        if (!foundComment) {
            return notFoundErrorResult('Comment is not found');
        }

        if (userId !== foundComment.commentatorInfo.userId) {
            return forbiddenErrorResult('You are not an owner');
        }

        const isCommentDeleted =
            await this.commentsRepository.deleteCommentById(id);
        if (!isCommentDeleted) {
            return notFoundErrorResult('Comment is not found');
        }

        await this.likesRepository.deleteLikesByParentId(id);

        return successResult(null);
    }
}
