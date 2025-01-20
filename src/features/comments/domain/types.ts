import { HydratedDocument, Model } from 'mongoose';
import { commentMethods, commentStatics } from './comment-entity';

export type TCommentatorInfo = {
    userId: string;
    userLogin: string;
};

export type TComment = {
    content: string;
    commentatorInfo: TCommentatorInfo;
    createdAt: string;
    postId: string;
    likesCount: number;
    dislikesCount: number;
};

export type CommentsDBSearchParams = {
    sortBy: 'createdAt';
    sortDirection: 1 | -1;
    skip: number;
    limit: number;
};

export type TCreateCommentDTO = {
    content: string;
    commentatorInfo: TCommentatorInfo;
    postId: string;
};

export type TUpdateCommentContentDTO = {
    content: string;
    userId: string;
};

export type TUpdateLikesCountDTO = {
    likesCount: number;
    dislikesCount: number;
};

type CommentStatics = typeof commentStatics;
type CommentMethods = typeof commentMethods;

export type TCommentModel = Model<TComment, object, CommentMethods> &
    CommentStatics;

export type CommentDocument = HydratedDocument<TComment, CommentMethods>;
