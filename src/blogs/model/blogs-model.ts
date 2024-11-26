import { OptionalId } from 'mongodb';
import { db } from '../../db';

export type TBlogInstance = {
    createdAt: string;
    description: string;
    isMembership: boolean;
    name: string;
    websiteUrl: string;
};

export const blogsCollection =
    db.collection<OptionalId<TBlogInstance>>('blogs');
