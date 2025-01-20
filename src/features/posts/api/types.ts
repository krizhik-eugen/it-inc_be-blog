import { Request } from 'express';
import {
    AllItemsViewModel,
    TIDParam,
    TResponseWithError,
    TSearchQueryParams,
} from '../../../shared/types';
import {
    CommentCreateRequestModel,
    CommentViewModel,
} from '../../comments/api/types';
import { NewestLikesViewModel } from '../../likes/api/types';
import { PostsDBSearchParams } from '../domain/types';
import { TLikeStatus } from '../../likes/domain/types';
import { CommentsDBSearchParams } from '../../comments/domain/types';

export type PostViewModel = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    createdAt: string;
    blogId: string;
    blogName: string;
    extendedLikesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: TLikeStatus;
        newestLikes: NewestLikesViewModel;
    };
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
