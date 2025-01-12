import { model, Schema } from 'mongoose';

export interface PostDBModel {
    blogId: string;
    blogName: string;
    content: string;
    createdAt: string;
    shortDescription: string;
    title: string;
    likesCount: number;
    dislikesCount: number;
}

export type PostsDBSearchParams = {
    sortBy: 'createdAt' | 'title' | 'blogName';
    sortDirection: 1 | -1;
    skip: number;
    limit: number;
};

const postsSchema = new Schema<PostDBModel>({
    blogId: String,
    blogName: String,
    content: String,
    createdAt: String,
    shortDescription: String,
    title: String,
    likesCount: Number,
    dislikesCount: Number,
});

export const PostsModel = model('posts', postsSchema);
