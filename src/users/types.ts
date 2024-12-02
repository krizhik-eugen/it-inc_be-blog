import { Request, Response } from 'express';
import { TIDParam, TSearchQueryParams } from '../types';
import { UsersDBSearchParams } from './model';

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

export type TGetAllUsersRequestQueries = TSearchQueryParams<UsersDBSearchParams['sortBy']> & { searchLoginTerm?: string, searchEmailTerm?: string };

export type TGetAllUsersRequest = Request<object, object, object, TGetAllUsersRequestQueries>;

export type TGetAllUsersResponse = Response<AllUsersResponseModel>;

export type TCreateNewUserRequest = Request<object, object, UserCreateRequestModel>;

export type TDeleteUserRequest = Request<TIDParam>;

export type TCreateNewUserResponse = Response<UserViewModel | { errorsMessages: { message: string, field: string }[]}>;
