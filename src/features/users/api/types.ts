import { Request } from 'express';
import {
    TIDParam,
    TResponseWithError,
    TSearchQueryParams,
} from '../../../shared/types';
import { UsersDBSearchParams } from '../domain/types';
import { createResponseError } from '../../../shared/helpers';

export type UserViewModel = {
    id: string;
    login: string;
    email: string;
    createdAt: string;
};

export type UserCreateRequestModel = {
    login: string;
    email: string;
    password: string;
};

export type AllUsersResponseModel = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: UserViewModel[];
};

export type TGetAllUsersRequestQueries = TSearchQueryParams<
    UsersDBSearchParams['sortBy']
> & { searchLoginTerm?: string; searchEmailTerm?: string };

export type TGetAllUsersRequest = Request<
    object,
    object,
    object,
    TGetAllUsersRequestQueries
>;

export type TGetAllUsersResponse = TResponseWithError<AllUsersResponseModel>;

export type TCreateNewUserRequest = Request<
    object,
    object,
    UserCreateRequestModel
>;

export type TGetUserRequest = Request<TIDParam>;

export type TDeleteUserRequest = Request<TIDParam>;

export type TCreateNewUserResponse = TResponseWithError<
    UserViewModel | ReturnType<typeof createResponseError>
>;
