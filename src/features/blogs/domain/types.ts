import { HydratedDocument, Model } from 'mongoose';
import { blogStatics } from './blog-entity';

export type TBlog = {
    name: string;
    description: string;
    websiteUrl: string;
    isMembership: boolean;
    createdAt: string;
};

export type BlogsDBSearchParams = {
    searchNameTerm?: string;
    sortBy: 'createdAt' | 'name';
    sortDirection: 1 | -1;
    skip: number;
    limit: number;
};

export type TCreateBlogDTO = {
    name: string;
    description: string;
    websiteUrl: string;
};

type BlogStatics = typeof blogStatics;

export type TBlogModel = Model<TBlog> & BlogStatics;

export type BlogDocument = HydratedDocument<TBlog>;
