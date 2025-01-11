import { model, Schema } from 'mongoose';
import { TLikeStatus } from '../types';

export interface LikeDBModel {
    status: TLikeStatus;
    createdAt: string;
    userId: string;
    parentId: string;
}

const likesSchema = new Schema<LikeDBModel>({
    createdAt: Date,
    status: String,
    userId: String,
    parentId: String,
});

export const LikesModel = model('likes', likesSchema);
