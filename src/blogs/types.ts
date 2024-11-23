import { Request } from 'express';

export type TBlog = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt?: string;
    isMembership?: boolean;
};
export type TParam = Pick<TBlog, 'id'>;
export type TGetDeleteDBInstanceRequest = Request<TParam, object, object>;
export type TCreateUpdateBlogRequest = Request<
    TParam,
    object,
    Omit<TBlog, 'id'>
>;
