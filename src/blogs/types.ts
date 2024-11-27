import { Request } from 'express';

export type TBlog = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt?: string;
    isMembership?: boolean;
};

export type TBlogQueryParams = {
    searchNameTerm?: string;
    sortBy?: 'createdAt' | 'name';
    sortDirection?: 'asc' | 'desc';
    pageNumber?: number;
    pageSize?: number;
};

export type TGetBlogsRequest = Request<object, object, object, TBlogQueryParams>;
export type TParam = Pick<TBlog, 'id'>;
export type TGetDeleteDBInstanceRequest = Request<TParam, object, object>;
export type TCreateUpdateBlogRequest = Request<
    TParam,
    object,
    Omit<TBlog, 'id'>
>;
