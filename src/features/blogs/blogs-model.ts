import { model, Schema } from 'mongoose';

export interface BlogDBModel {
    name: string;
    description: string;
    websiteUrl: string;
    isMembership: boolean;
    createdAt: string;
}

export type BlogsDBSearchParams = {
    searchNameTerm?: string;
    sortBy: 'createdAt' | 'name';
    sortDirection: 1 | -1;
    skip: number;
    limit: number;
};

const blogsSchema = new Schema<BlogDBModel>({
    name: String,
    description: String,
    websiteUrl: String,
    isMembership: Boolean,
    createdAt: String,
});

export const BlogsModel = model('blogs', blogsSchema);
