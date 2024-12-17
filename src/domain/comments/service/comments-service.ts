import { CommentCreateRequestModel } from '../types';
import { ObjectId } from 'mongodb';
import { commentsRepository } from '../repository/comments-repository';
import { postsRepository } from '../../../domain/posts';
import { CommentDBModel } from '../model';
import { usersRepository } from '../../../domain/users';

export const commentsService = {
    async createNewCommentForPost({
        content,
        id,
        userId,
    }: CommentCreateRequestModel & { id: string; userId: string }) {
        const postId = id;
        const post = await postsRepository.findPostById(new ObjectId(postId));
        if (!post) {
            return;
        }
        const user = await usersRepository.findUserById(new ObjectId(userId));
        const newComment: CommentDBModel = {
            content,
            commentatorInfo: {
                userId,
                userLogin: user!.login,
            },
            postId,
            createdAt: new Date().toISOString(),
        };
        return await commentsRepository.addNewComment(newComment);
    },

    async updateComment({
        content,
        id,
    }: CommentCreateRequestModel & { id: string }) {
        const isCommentUpdated = await commentsRepository.updateComment({
            _id: new ObjectId(id),
            content,
        });
        return isCommentUpdated;
    },

    async deleteComment(id: string) {
        const isCommentDeleted = await commentsRepository.deleteComment(
            new ObjectId(id)
        );
        return isCommentDeleted;
    },
};