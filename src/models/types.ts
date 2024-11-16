import { TDBBaseInstance } from '../db';

export type TBlog = TDBBaseInstance & {
    name: string;
    description: string;
    websiteUrl: string;
};

export type TPost = TDBBaseInstance & {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName?: string;
};
