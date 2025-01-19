import { HydratedDocument, Model } from 'mongoose';
import { likeMethods, likeStatics } from './like-entity';

export type TLikeStatus = 'Like' | 'Dislike' | 'None';

export type TLike = {
    status: TLikeStatus;
    createdAt: string;
    userId: string;
    parentId: string;
};

export type TCreateLikeDTO = {
    userId: string;
    parentId: string;
    status: TLikeStatus;
};

type LikeStatics = typeof likeStatics;
type LikeMethods = typeof likeMethods;

export type TLikeModel = Model<TLike, object, LikeMethods> & LikeStatics;

export type LikeDocument = HydratedDocument<TLike, LikeMethods>;
