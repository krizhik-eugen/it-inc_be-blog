import { NextFunction, Response, Request } from 'express';
import { checkSchema, Schema, validationResult } from 'express-validator';
import {
    DEFAULT_SEARCH_PARAMS,
    HTTP_STATUS_CODES,
    ResultStatus,
} from '../constants';
import { TMappedSearchQueryParams, TSearchQueryParams, TStatus } from './types';

const errorValidator = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            errorsMessages: errors.map((error) => ({
                message: error.msg,
                field: error.type === 'field' ? error.path : '',
            })),
        });
        return;
    }
    next();
};

export const createResponseError = (message: string, field = '') =>
    ({
        errorsMessages: [
            {
                message,
                field,
            },
        ],
    }) as const;

export const requestValidator = ({
    bodySchema,
    paramSchema,
    querySchema,
}: {
    bodySchema?: Schema;
    paramSchema?: Schema;
    querySchema?: Schema;
}) => {
    const schema: Schema = {
        ...bodySchema,
        ...paramSchema,
        ...querySchema,
    };
    const scopes: Parameters<typeof checkSchema>[1] = [];
    if (bodySchema) scopes.push('body');
    if (paramSchema) scopes.push('params');
    if (querySchema) scopes.push('query');
    return [checkSchema(schema, scopes), errorValidator];
};

export const getSearchQueries = <T>(queries: TSearchQueryParams<T>) => {
    const { sortBy, sortDirection, pageNumber, pageSize } = queries;
    let mappedSortDirection: 1 | -1;
    if (sortDirection === 'asc') {
        mappedSortDirection = 1;
    } else if (sortDirection === 'desc') {
        mappedSortDirection = -1;
    } else {
        mappedSortDirection = DEFAULT_SEARCH_PARAMS.sortDirection;
    }
    const searchQueries: TMappedSearchQueryParams<T> = {
        sortBy: sortBy || (DEFAULT_SEARCH_PARAMS.sortBy as T),
        sortDirection: mappedSortDirection,
        pageNumber: Number(pageNumber) || DEFAULT_SEARCH_PARAMS.pageNumber,
        pageSize: Number(pageSize) || DEFAULT_SEARCH_PARAMS.pageSize,
    };
    return searchQueries;
};

export const getDBSearchQueries = <T>(
    searchQueries: TMappedSearchQueryParams<T>
) => {
    const { sortBy, sortDirection, pageNumber, pageSize } = searchQueries;
    const dbSearchQueries = {
        sortBy,
        sortDirection,
        skip: (pageNumber - 1) * pageSize,
        limit: pageSize ?? 0,
    };
    return dbSearchQueries;
};

export const resultCodeToHttpException = (resultCode: TStatus): number => {
    switch (resultCode) {
        case ResultStatus.BadRequest:
            return HTTP_STATUS_CODES.BAD_REQUEST;
        case ResultStatus.Forbidden:
            return HTTP_STATUS_CODES.FORBIDDEN;
        default:
            return HTTP_STATUS_CODES.SERVER_ERROR;
    }
};
