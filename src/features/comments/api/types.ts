import { Request } from 'express';
import { TIDParam, TResponseWithError } from '../../../shared/types';
import { LikesViewModel } from '../../likes/api/types';
import { TCommentatorInfo } from '../domain/types';

export type CommentViewModel = {
    id: string;
    content: string;
    commentatorInfo: TCommentatorInfo;
    createdAt: string;
    likesInfo: LikesViewModel;
};

export type CommentCreateRequestModel = {
    content: string;
};

export type TGetCommentRequest = Request<TIDParam, object, object, object>;

export type TGetCommentResponse = TResponseWithError<CommentViewModel>;

export type TUpdateCommentRequest = Request<
    TIDParam,
    object,
    CommentCreateRequestModel
>;

export type TDeleteCommentByIdRequest = Request<TIDParam>;
