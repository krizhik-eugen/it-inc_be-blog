import { Request } from 'express';
import { TDBBaseInstance } from '../db';

export type TBlog = TDBBaseInstance & {
    name: string;
    description: string;
    websiteUrl: string;
};
export type TParam = Pick<TBlog, 'id'>;
export type TGetDeleteDBInstanceRequest = Request<TParam, object, object>;
export type TCreateUpdateBlogRequest = Request<
    TParam,
    object,
    Omit<TBlog, 'id'>
>;