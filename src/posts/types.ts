// import { Request } from 'express';
// import { TSearchQueryParams } from '../types';

// export type TPost = {
//     id: string;
//     title: string;
//     shortDescription: string;
//     content: string;
//     blogId: string;
//     blogName?: string;
//     createdAt?: string;
// };

// export type TGetPostsResponse = {
//     pagesCount: number;
//     page: number;
//     pageSize: number;
//     totalCount: number;
//     items: TPost[];
// };

// export type TPostSearchParams = Request<
//     object,
//     object,
//     object,
//     TSearchQueryParams
// >;
// export type TParam = { id: string };
// export type TGetDeleteDBInstanceRequest = Request<TParam, object, object>;
// export type TCreateUpdatePostRequest = Request<
//     TParam,
//     object,
//     Omit<TPost, 'id' | 'blogName'>
// >;

import { Request, Response } from 'express';
import { AllItemsViewModel, TIDParam, TSearchQueryParams } from '../types';
import { PostsDBSearchParams } from './model/posts-model';

export type PostViewModel = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    createdAt: string;
    blogId: string;
    blogName: string;
};

export type PostCreateRequestModel = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
};

export type TGetAllPostsRequestQueries = TSearchQueryParams<PostsDBSearchParams['sortBy']>

export type TGetAllPostsRequest = Request<object,object,object,TGetAllPostsRequestQueries>;

export type TGetAllPostsResponse = Response<AllItemsViewModel<PostViewModel>>

export type TCreateNewPostRequest = Request<object,object,PostCreateRequestModel>;

export type TCreateNewPostResponse = Response<PostViewModel>

export type TGetPostRequest = Request<TIDParam,object,object,object>;

export type TGetPostResponse = Response<PostViewModel>

export type TUpdatePostRequest = Request<TIDParam,object,PostCreateRequestModel>;

export type TDeletePostRequest = Request<TIDParam>;


