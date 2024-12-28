import { Request } from 'express';
import {
    AllItemsViewModel,
    TIDParam,
    TResponseWithError,
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

export type TGetAllPostsResponse = TResponseWithError<
    AllItemsViewModel<PostViewModel>
>;

export type TCreateNewPostRequest = Request<
    object,
    object,
    PostCreateRequestModel
>;

export type TCreateNewPostResponse = TResponseWithError<PostViewModel>;

export type TGetPostRequest = Request<TIDParam, object, object, object>;

export type TGetPostResponse = TResponseWithError<PostViewModel>;

export type TUpdatePostRequest = Request<
    TIDParam,
    object,
    PostCreateRequestModel
>;
export type TUpdatePostResponse = TResponseWithError;

export type TDeletePostRequest = Request<TIDParam>;

export type TDeletePostResponse = TResponseWithError;

export type TGetAllPostCommentsRequestQueries = TSearchQueryParams<
    CommentsDBSearchParams['sortBy']
>;

export type TGetAllPostCommentsRequest = Request<
    TIDParam,
    object,
    object,
    TGetAllPostCommentsRequestQueries
>;

export type TGetAllPostCommentsResponse = TResponseWithError<
    AllItemsViewModel<CommentViewModel>
>;

export type TCreateNewPostCommentRequest = Request<
    TIDParam,
    object,
    CommentCreateRequestModel
>;

export type TCreateNewPostCommentResponse =
    TResponseWithError<CommentViewModel>;
