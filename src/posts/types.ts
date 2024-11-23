import { Request } from 'express';

export type TPost = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName?: string;
};
export type TParam = { id: string };
export type TGetDeleteDBInstanceRequest = Request<TParam, object, object>;
export type TCreateUpdatePostRequest = Request<
    TParam,
    object,
    Omit<TPost, 'id' | 'blogName'>
>;
