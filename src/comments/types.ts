import { Request, Response } from 'express';
import { TIDParam } from '../shared/types';

export type TCommentatorInfo = {
    userId: string;
    userLogin: string;
};

export type CommentViewModel = {
    id: string;
    content: string;
    commentatorInfo: TCommentatorInfo;
    createdAt: string;
};

export type CommentCreateRequestModel = {
    content: string;
};

export type TGetCommentRequest = Request<TIDParam, object, object, object>;

export type TGetCommentResponse = Response<CommentViewModel>;

export type TUpdateCommentRequest = Request<
    TIDParam,
    object,
    CommentCreateRequestModel
>;

export type TDeleteCommentRequest = Request<TIDParam>;
