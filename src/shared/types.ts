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

type ExtensionType = {
    field: string | null;
    message: string;
};

export type TStatus = (typeof ResultStatus)[keyof typeof ResultStatus];

export type TResult<T = null> = {
    status: TStatus;
    errorMessage?: string;
    extensions: ExtensionType[];
    data: T;
};
