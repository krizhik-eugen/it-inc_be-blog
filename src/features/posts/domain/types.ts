import { HydratedDocument, Model } from 'mongoose';
import { postStatics } from './post-entity';

export type TPost = {
    blogId: string;
    blogName: string;
    content: string;
    createdAt: string;
    shortDescription: string;
    title: string;
    likesCount: number;
    dislikesCount: number;
};

export type PostsDBSearchParams = {
    sortBy: 'createdAt' | 'title' | 'blogName';
    sortDirection: 1 | -1;
    skip: number;
    limit: number;
};

export type TCreatePostDTO = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
};

type PostStatics = typeof postStatics;

export type TPostModel = Model<TPost> & PostStatics;

export type PostDocument = HydratedDocument<TPost>;
