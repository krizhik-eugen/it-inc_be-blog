import { OptionalUnlessRequiredId } from 'mongodb';
import { db } from '../../db';

export type CommentDBModel = OptionalUnlessRequiredId<{
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: string;
    postId: string;
}>;

export type CommentsDBSearchParams = {
    sortBy: 'createdAt';
    sortDirection: 1 | -1;
    skip: number;
    limit: number;
};

export const commentsCollection = db.collection<CommentDBModel>('comments');
