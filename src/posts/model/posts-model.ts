import { OptionalId } from 'mongodb';
import { db } from '../../db';

export type TPostInstance = {
    blogId: string;
    blogName: string;
    content: string;
    createdAt: string;
    shortDescription: string;
    title: string;
};

export const postsCollection =
    db.collection<OptionalId<TPostInstance>>('posts');
