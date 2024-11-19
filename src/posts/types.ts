import { Request } from 'express';
import { TDBBaseInstance } from '../db';

export type TPost = TDBBaseInstance & {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName?: string;
};
export type TParam = Pick<TPost, 'id'>;
export type TGetDeleteDBInstanceRequest = Request<TParam, object, object>;
export type TCreateUpdatePostRequest = Request<
    TParam,
    object,
    Omit<TPost, 'id' | 'blogName'>
>;
