import { OptionalUnlessRequiredId } from 'mongodb';
import { db } from '../../../db';

export type PostDBModel = OptionalUnlessRequiredId<{
    blogId: string;
    blogName: string;
    content: string;
    createdAt: string;
    shortDescription: string;
    title: string;
}>;

export type PostsDBSearchParams = {
    sortBy: 'createdAt' | 'title' | 'blogName';
    sortDirection: 1 | -1;
    skip: number;
    limit: number;
};

export const postsCollection = db.collection<PostDBModel>('posts');
