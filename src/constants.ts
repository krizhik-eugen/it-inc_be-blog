import { TMappedSearchQueryParams } from './shared/types';

export const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
} as const;

export const DEFAULT_SEARCH_PARAMS: TMappedSearchQueryParams<string> = {
    sortBy: 'createdAt' as string,
    sortDirection: -1,
    pageNumber: 1,
    pageSize: 10,
};

export const ResultStatus = {
    Success: 'Success',
    NotFound: 'NotFound',
    Forbidden: 'Forbidden',
    Unauthorized: 'Unauthorized',
    BadRequest: 'BadRequest',
    InternalError: 'InternalError',
} as const;
