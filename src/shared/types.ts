import { Response } from 'express';
import { ResultStatus } from '../constants';
export type TSearchQueryParams<T> = {
    sortBy?: T;
    sortDirection?: 'asc' | 'desc';
    pageNumber?: string;
    pageSize?: string;
};

export type TMappedSearchQueryParams<T> = {
    sortBy: T;
    sortDirection: 1 | -1;
    pageNumber: number;
    pageSize: number;
};

export type TIDParam = {
    id: string;
};

export type AllItemsViewModel<T> = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: T[];
};

export type TErrorType = {
    field: string;
    message: string;
};

export type TStatus = (typeof ResultStatus)[keyof typeof ResultStatus];

export type TResult<T = null> =
    | { status: Extract<TStatus, 'Success'>; data: T; errorsMessages?: never }
    | {
          status: Exclude<TStatus, 'Success'>;
          data?: never;
          errorsMessages: TErrorType[];
      };

export type TResponseWithError<T = undefined> = Response<
    T | { errorsMessages: { field: string; message: string }[] }
>;
