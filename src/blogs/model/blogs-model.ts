import { OptionalUnlessRequiredId } from 'mongodb';
import { db } from '../../db';

export type BlogDBModel = OptionalUnlessRequiredId<{
    name: string;
    description: string;
    websiteUrl: string;
    isMembership: boolean;
    createdAt: string;
}>;

export type BlogsDBSearchParams = {
    searchNameTerm?: string;
    sortBy: 'createdAt' | 'name';
    sortDirection: 1 | -1;
    skip: number;
    limit: number;
};

export const blogsCollection = db.collection<BlogDBModel>('blogs');
