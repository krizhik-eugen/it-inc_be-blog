import { Request } from 'express';
import { TIDParam } from '../../shared/types';

export type TLikeStatus = 'Like' | 'Dislike' | 'None';

export type LikesViewModel = {
    likesCount: number;
    dislikesCount: number;
    myStatus: TLikeStatus;
};

export type LikeStatusRequestModel = {
    likeStatus: TLikeStatus;
};

export type TUpdateLikeStatusRequest = Request<
    TIDParam,
    object,
    LikeStatusRequestModel
>;
