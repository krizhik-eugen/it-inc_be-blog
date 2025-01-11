import { model, Schema } from 'mongoose';

export interface CommentDBModel {
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: string;
    postId: string;
    likesCount: number;
    dislikesCount: number;
}

export type CommentsDBSearchParams = {
    sortBy: 'createdAt';
    sortDirection: 1 | -1;
    skip: number;
    limit: number;
};

const commentsSchema = new Schema<CommentDBModel>({
    content: String,
    commentatorInfo: {
        userId: String,
        userLogin: String,
    },
    createdAt: String,
    postId: String,
    likesCount: Number,
    dislikesCount: Number,
});

export const CommentsModel = model('comments', commentsSchema);
