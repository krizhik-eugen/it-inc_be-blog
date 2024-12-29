import { Request } from 'express';
import {
    AllItemsViewModel,
    TIDParam,
    TResponseWithError,
    TSearchQueryParams,
} from '../../shared/types';
import { BlogsDBSearchParams } from './model';
import {
    PostViewModel,
    TGetAllPostsRequestQueries,
    PostCreateRequestModel,
} from '../posts';

export type BlogViewModel = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
};

export type BlogCreateRequestModel = {
    name: string;
    description: string;
    websiteUrl: string;
};

export type TGetAllBlogsRequestQueries = TSearchQueryParams<
    BlogsDBSearchParams['sortBy']
> & { searchNameTerm?: string };

export type TGetAllBlogsRequest = Request<
    object,
    object,
    object,
    TGetAllBlogsRequestQueries
>;

export type TGetAllBlogsResponse = TResponseWithError<
    AllItemsViewModel<BlogViewModel>
>;

export type TCreateNewBlogRequest = Request<
    object,
    object,
    BlogCreateRequestModel
>;

export type TCreateNewBlogResponse = TResponseWithError<BlogViewModel>;

export type TGetBlogRequest = Request<TIDParam, object, object, object>;

export type TGetBlogResponse = TResponseWithError<BlogViewModel>;

export type TUpdateBlogRequest = Request<
    TIDParam,
    object,
    BlogCreateRequestModel
>;

export type TDeleteBlogRequest = Request<TIDParam>;

export type TGetAllBlogPostsRequest = Request<
    TIDParam,
    object,
    object,
    TGetAllPostsRequestQueries
>;

export type TGetAllBlogPostsResponse = TResponseWithError<
    AllItemsViewModel<PostViewModel>
>;

export type TCreateNewBlogPostRequest = Request<
    TIDParam,
    object,
    Omit<PostCreateRequestModel, 'blogId'>
>;

export type TCreateNewBlogPostResponse = TResponseWithError<PostViewModel>;
