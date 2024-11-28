import { Request } from 'express';
import { TPost } from '../posts/types';
import { TSearchQueryParams } from '../types';

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
} & TSearchQueryParams;

export type TGetBlogsResponse = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: TBlog[] | TPost[];
};


export type TBlogSearchParams = Request<object, object, object , TBlogQueryParams>;
export type TParam = Pick<TBlog, 'id'>;
export type TGetDeleteDBInstanceRequest = Request<TParam, object, object, object>;
export type TCreateUpdateBlogRequest = Request<
    TParam,
    object,
    Omit<TBlog, 'id'>
>;
