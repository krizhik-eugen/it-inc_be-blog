import { HydratedDocument, Model } from 'mongoose';
import { postMethods, postStatics } from './post-entity';

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

export type TUpdatePostDTO = {
    title?: string;
    shortDescription?: string;
    content?: string;
};

export type TUpdateLikesCountDTO = {
    likesCount: number;
    dislikesCount: number;
};

type PostStatics = typeof postStatics;
type PostMethods = typeof postMethods;

export type TPostModel = Model<TPost, object, PostMethods> & PostStatics;

export type PostDocument = HydratedDocument<TPost, PostMethods>;
