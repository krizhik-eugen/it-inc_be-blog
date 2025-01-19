import { Request } from 'express';
import { TIDParam } from '../../../shared/types';
import { TLikeStatus } from '../domain/types';

export type LikesViewModel = {
    likesCount: number;
    dislikesCount: number;
    myStatus: TLikeStatus;
};

export type NewestLikesViewModel = {
    addedAt: string;
    userId: string;
    login: string;
}[];

export type LikeStatusRequestModel = {
    likeStatus: TLikeStatus;
};

export type TUpdateLikeStatusRequest = Request<
    TIDParam,
    object,
    LikeStatusRequestModel
>;
