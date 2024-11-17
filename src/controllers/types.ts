import { Request } from 'express';
import { TBlog, TPost } from '../models';

export type TParam = Pick<TPost, 'id'>;
export type TGetDeleteDBInstanceRequest = Request<TParam, object, object>;
export type TCreateUpdatePostRequest = Request<
    TParam,
    object,
    Omit<TPost, 'id' | 'blogName'>
>;

export type TCreateUpdateBlogRequest = Request<
    TParam,
    object,
    Omit<TBlog, 'id'>
>;
