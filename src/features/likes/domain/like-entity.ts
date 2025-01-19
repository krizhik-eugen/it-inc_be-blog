import { model, Schema } from 'mongoose';
import {
    LikeDocument,
    TCreateLikeDTO,
    TLike,
    TLikeModel,
    TLikeStatus,
} from './types';

const likeTypes: TLikeStatus[] = ['Like', 'Dislike', 'None'];

const likeSchema = new Schema<TLike>({
    createdAt: {
        type: String,
        default: () => new Date().toISOString(),
    },
    status: {
        type: String,
        enum: likeTypes,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    parentId: {
        type: String,
        required: true,
    },
});

export const likeStatics = {
    createNewLike(dto: TCreateLikeDTO) {
        const newLike = new LikeModel(dto);
        return newLike;
    },
};

export const likeMethods = {
    updateStatus(status: TLikeStatus) {
        const that = this as LikeDocument;
        that.status = status;
    },
};

likeSchema.statics = likeStatics;
likeSchema.methods = likeMethods;

export const LikeModel = model<TLike, TLikeModel>('likes', likeSchema);
