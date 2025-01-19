import { model, Schema } from 'mongoose';
import { TBlog, TBlogModel, TCreateBlogDTO } from './types';
import {
    blogDescriptionValidation,
    blogNameValidation,
    blogWebsiteUrlValidation,
} from './settings';

const blogSchema = new Schema<TBlog>({
    name: {
        type: String,
        required: true,
        maxlength: blogNameValidation.maxLength,
    },
    description: {
        type: String,
        required: true,
        maxlength: blogDescriptionValidation.maxLength,
    },
    websiteUrl: {
        type: String,
        required: true,
        maxlength: blogWebsiteUrlValidation.maxLength,
        validate: {
            validator: (value: string) =>
                blogWebsiteUrlValidation.pattern.test(value),
            message: blogWebsiteUrlValidation.errorMessagePattern,
        },
    },
    isMembership: { type: Boolean, required: true, default: false },
    createdAt: {
        type: String,
        default: () => new Date().toISOString(),
    },
});

export const blogStatics = {
    createNewBlog(dto: TCreateBlogDTO) {
        const newBlog = new BlogModel(dto);
        return newBlog;
    },
};

blogSchema.statics = blogStatics;

export const BlogModel = model<TBlog, TBlogModel>('blogs', blogSchema);
