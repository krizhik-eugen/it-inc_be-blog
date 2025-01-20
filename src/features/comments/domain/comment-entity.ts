import { model, Schema } from 'mongoose';
import {
    CommentDocument,
    TComment,
    TCommentModel,
    TCreateCommentDTO,
    TUpdateCommentContentDTO,
    TUpdateLikesCountDTO,
} from './types';
import { commentContentValidation } from './settings';

const commentSchema = new Schema<TComment>({
    content: {
        type: String,
        required: true,
        minlength: commentContentValidation.minLength,
        maxlength: commentContentValidation.maxLength,
    },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    createdAt: {
        type: String,
        default: () => new Date().toISOString(),
    },
    postId: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
});

export const commentStatics = {
    createNewComment(dto: TCreateCommentDTO) {
        const newComment = new CommentModel(dto);

        return newComment;
    },
};

export const commentMethods = {
    updateContent(dto: TUpdateCommentContentDTO) {
        const that = this as CommentDocument;
        let error = '';
        if (dto.userId !== that.commentatorInfo.userId) {
            error = 'You are not an owner';
        }
        return { error };
    },
    updateLikesCount(dto: TUpdateLikesCountDTO) {
        const that = this as CommentDocument;
        that.likesCount = dto.likesCount;
        that.dislikesCount = dto.dislikesCount;
    },
};

commentSchema.statics = commentStatics;
commentSchema.methods = commentMethods;

export const CommentModel = model<TComment, TCommentModel>(
    'comments',
    commentSchema
);
