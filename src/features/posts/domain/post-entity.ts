import { model, Schema } from 'mongoose';
import {
    PostDocument,
    TCreatePostDTO,
    TPost,
    TPostModel,
    TUpdateLikesCountDTO,
    TUpdatePostDTO,
} from './types';
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

export const postMethods = {
    updatePost(dto: TUpdatePostDTO) {
        const { title, shortDescription, content } = dto;
        const that = this as PostDocument;

        if (title) {
            that.title = title;
        }
        if (shortDescription) {
            that.shortDescription = shortDescription;
        }
        if (content) {
            that.content = content;
        }
    },

    updateLikesCount(dto: TUpdateLikesCountDTO) {
        const that = this as PostDocument;
        that.likesCount = dto.likesCount;
        that.dislikesCount = dto.dislikesCount;
    },
};

postSchema.statics = postStatics;
postSchema.methods = postMethods;

export const PostModel = model<TPost, TPostModel>('posts', postSchema);
