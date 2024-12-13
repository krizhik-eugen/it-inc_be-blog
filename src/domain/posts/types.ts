import { Request, Response } from 'express';
import {
    AllItemsViewModel,
    TIDParam,
    TSearchQueryParams,
} from '../../shared/types';
import { PostsDBSearchParams } from './model/posts-model';
import {
    CommentCreateRequestModel,
    CommentsDBSearchParams,
    CommentViewModel,
} from '../comments';

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

export type TGetAllPostsRequestQueries = TSearchQueryParams<
    PostsDBSearchParams['sortBy']
>;

export type TGetAllPostsRequest = Request<
    object,
    object,
    object,
    TGetAllPostsRequestQueries
>;

export type TGetAllPostsResponse = Response<AllItemsViewModel<PostViewModel>>;

export type TCreateNewPostRequest = Request<
    object,
    object,
    PostCreateRequestModel
>;

export type TCreateNewPostResponse = Response<PostViewModel>;

export type TGetPostRequest = Request<TIDParam, object, object, object>;

export type TGetPostResponse = Response<PostViewModel>;

export type TUpdatePostRequest = Request<
    TIDParam,
    object,
    PostCreateRequestModel
>;

export type TDeletePostRequest = Request<TIDParam>;

export type TGetAllPostCommentsRequestQueries = TSearchQueryParams<
    CommentsDBSearchParams['sortBy']
>;

export type TGetAllPostCommentsRequest = Request<
    TIDParam,
    object,
    object,
    TGetAllPostCommentsRequestQueries
>;

export type TGetAllPostCommentsResponse = Response<
    AllItemsViewModel<CommentViewModel>
>;

export type TCreateNewPostCommentRequest = Request<
    TIDParam,
    object,
    CommentCreateRequestModel
>;

export type TCreateNewPostCommentResponse = Response<CommentViewModel>;
