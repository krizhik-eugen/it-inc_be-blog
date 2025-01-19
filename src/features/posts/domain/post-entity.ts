import { model, Schema } from 'mongoose';
import { TCreatePostDTO, TPost, TPostModel } from './types';
import {
    postContentValidation,
    postShortDescriptionValidation,
    postTitleValidation,
} from './settings';

const postSchema = new Schema<TPost>({
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    content: {
        type: String,
        required: true,
        maxlength: postContentValidation.maxLength,
    },
    createdAt: {
        type: String,
        default: () => new Date().toISOString(),
    },
    shortDescription: {
        type: String,
        required: true,
        maxlength: postShortDescriptionValidation.maxLength,
    },
    title: {
        type: String,
        required: true,
        maxlength: postTitleValidation.maxLength,
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    dislikesCount: {
        type: Number,
        default: 0,
    },
});

export const postStatics = {
    createNewPost(dto: TCreatePostDTO) {
        const newPost = new PostModel(dto);
        return newPost;
    },
};

postSchema.statics = postStatics;

export const PostModel = model<TPost, TPostModel>('posts', postSchema);
