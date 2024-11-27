import { TSearchQueryParams } from "./types";

export const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
} as const;

export const DEFAULT_SEARCH_PARAMS: Required<TSearchQueryParams> = {
    sortBy: 'createdAt',
    sortDirection: 'desc',
    pageNumber: 1,
    pageSize: 10,
} as const;