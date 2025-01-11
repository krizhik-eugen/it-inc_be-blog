import { CommentsRepository } from '../repository';
import { CommentCreateRequestModel } from '../types';
import { CommentDBModel } from '../model';
import { UsersRepository } from '../../users/repository';
import { PostsRepository } from '../../posts/repository';
import {
    forbiddenErrorResult,
    internalErrorResult,
    notFoundErrorResult,
    successResult,
} from '../../../shared/helpers';
import { TResult } from '../../../shared/types';
import { TLikeStatus } from '../../likes/types';
import { LikesRepository } from '../../likes/repository/likes-repository';

export class CommentsService {
    constructor(
        protected commentsRepository: CommentsRepository,
        protected usersRepository: UsersRepository,
        protected postsRepository: PostsRepository,
        protected likesRepository: LikesRepository
    ) {}

    async createNewCommentForPost(
        content: CommentCreateRequestModel['content'],
        id: string,
        userId: string
    ): Promise<TResult<{ id: string }>> {
        const postId = id;
        const post = await this.postsRepository.findPostById(postId);
        if (!post) {
            return notFoundErrorResult('Post is not found');
        }
        const user = await this.usersRepository.findUserById(userId);
        const newComment: CommentDBModel = {
            content,
            commentatorInfo: {
                userId,
                userLogin: user!.accountData.login,
            },
            postId,
            createdAt: new Date().toISOString(),
            likesCount: 0,
            dislikesCount: 0,
        };
        const createdCommentId =
            await this.commentsRepository.addNewComment(newComment);
        if (!createdCommentId) {
            return internalErrorResult('The error occurred during creation');
        }
        return successResult({ id: createdCommentId });
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
        if (userId !== comment.commentatorInfo.userId) {
            return forbiddenErrorResult('You are not an owner');
        }
        const isCommentUpdated = await this.commentsRepository.updateComment({
            id,
            content,
        });
        if (!isCommentUpdated) {
            return notFoundErrorResult('Comment is not found');
        }
        return successResult(null);
    }

    async updateCommentLikeStatus(
        likeStatus: TLikeStatus,
        id: string,
        userId: string
    ): Promise<TResult> {
        const comment = await this.commentsRepository.findCommentById(id);
        if (!comment) {
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
        await this.commentsRepository.updateComment({
            id,
            likesCount,
            dislikesCount,
        });
        return successResult(null);
    }

    async deleteComment(id: string, userId: string): Promise<TResult> {
        const comment = await this.commentsRepository.findCommentById(id);
        if (!comment) {
            return notFoundErrorResult('Comment is not found');
        }
        if (userId !== comment.commentatorInfo.userId) {
            return forbiddenErrorResult('You are not an owner');
        }
        const isCommentDeleted =
            await this.commentsRepository.deleteComment(id);
        if (!isCommentDeleted) {
            return notFoundErrorResult('Comment is not found');
        }
        await this.likesRepository.deleteLikesByParentId(id);
        return successResult(null);
    }
}
