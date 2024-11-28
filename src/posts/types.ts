import { Request } from 'express';
import { TSearchQueryParams } from '../types';

export type TPost = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName?: string;
    createdAt?: string;
};

export type TGetPostsResponse = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: TPost[];
};


export type TPostSearchParams = Request<object, object, object , TSearchQueryParams>;
export type TParam = { id: string };
export type TGetDeleteDBInstanceRequest = Request<TParam, object, object>;
export type TCreateUpdatePostRequest = Request<
    TParam,
    object,
    Omit<TPost, 'id' | 'blogName'>
>;
