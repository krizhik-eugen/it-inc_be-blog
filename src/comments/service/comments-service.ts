import { TDeleteCommentRequest, TUpdateCommentRequest } from '../types';

import { ObjectId } from 'mongodb';
import { commentsRepository } from '../repository/comments-repository';
import { postsRepository, TCreateNewPostCommentRequest } from '../../posts';
import { createResponseError } from '../../helpers';
import { CommentDBModel } from '../model';
import { usersRepository } from '../../users';

export const commentsService = {
    async createNewCommentForPost(req: TCreateNewPostCommentRequest) {
        const post = await postsRepository.findPostById(
            new ObjectId(req.params.id)
        );
        if (!post) {
            return await Promise.resolve(
                createResponseError('Incorrect Blog Id, no blogs found', 'id')
            );
        }
        const userId = req.userId!;
        const user = await usersRepository.findUserById(new ObjectId(userId));
        const newComment: CommentDBModel = {
            content: req.body.content,
            commentatorInfo: {
                userId,
                userLogin: user!.login,
            },
            postId: req.params.id,
            createdAt: new Date().toISOString(),
        };
        return await commentsRepository.addNewComment(newComment);
    },

    async updateComment(req: TUpdateCommentRequest) {
        const isCommentUpdated = await commentsRepository.updateComment({
            _id: new ObjectId(req.params.id),
            content: req.body.content,
        });
        return isCommentUpdated;
    },

    async deleteComment(req: TDeleteCommentRequest) {
        const isCommentDeleted = await commentsRepository.deleteComment(
            new ObjectId(req.params.id)
        );
        return isCommentDeleted;
    },
};
