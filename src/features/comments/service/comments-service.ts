import { CommentCreateRequestModel } from '../types';
import { ObjectId } from 'mongodb';
import { commentsRepository } from '../repository/comments-repository';
import { postsRepository } from '../../../features/posts';
import { CommentDBModel } from '../model';
import { usersRepository } from '../../../features/users';
import { createResponseError } from '../../../shared/helpers';
import { TResult } from '../../../shared/types';

export const commentsService = {
    async createNewCommentForPost(
        content: CommentCreateRequestModel['content'],
        id: string,
        userId: string
    ): Promise<TResult<{ id: string }>> {
        const postId = id;
        const post = await postsRepository.findPostById(new ObjectId(postId));
        if (!post) {
            return {
                status: 'NotFound',
                errorsMessages: [createResponseError('Post is not found')],
            };
        }
        const user = await usersRepository.findUserById(new ObjectId(userId));
        const newComment: CommentDBModel = {
            content,
            commentatorInfo: {
                userId,
                userLogin: user!.accountData.login,
            },
            postId,
            createdAt: new Date().toISOString(),
        };
        const createdCommentId =
            await commentsRepository.addNewComment(newComment);
        if (!createdCommentId) {
            return {
                status: 'InternalError',
                errorsMessages: [
                    createResponseError('The error occurred during creation'),
                ],
            };
        }
        return {
            status: 'Success',
            data: { id: createdCommentId },
        };
    },

    async updateComment(
        content: CommentCreateRequestModel['content'],
        id: string,
        userId: string
    ): Promise<TResult> {
        const comment = await commentsRepository.findCommentById(
            new ObjectId(id)
        );
        if (!comment) {
            return {
                status: 'NotFound',
                errorsMessages: [createResponseError('Comment is not found')],
            };
        }
        if (userId !== comment.commentatorInfo.userId) {
            return {
                status: 'Forbidden',
                errorsMessages: [createResponseError('You are not an owner')],
            };
        }
        const isCommentUpdated = await commentsRepository.updateComment({
            _id: new ObjectId(id),
            content,
        });
        if (!isCommentUpdated) {
            return {
                status: 'NotFound',
                errorsMessages: [createResponseError('Comment is not found')],
            };
        }
        return {
            status: 'Success',
            data: null,
        };
    },

    async deleteComment(id: string, userId: string): Promise<TResult> {
        const comment = await commentsRepository.findCommentById(
            new ObjectId(id)
        );
        if (!comment) {
            return {
                status: 'NotFound',
                errorsMessages: [createResponseError('Comment is not found')],
            };
        }
        if (userId !== comment.commentatorInfo.userId) {
            return {
                status: 'Forbidden',
                errorsMessages: [createResponseError('You are not an owner')],
            };
        }
        const isCommentDeleted = await commentsRepository.deleteComment(
            new ObjectId(id)
        );
        if (!isCommentDeleted) {
            return {
                status: 'NotFound',
                errorsMessages: [createResponseError('Comment is not found')],
            };
        }
        return {
            status: 'Success',
            data: null,
        };
    },
};
