import { NextFunction, Response, Request } from 'express';
import { checkSchema, Schema, validationResult } from 'express-validator';
import { DEFAULT_SEARCH_PARAMS, HTTP_STATUS_CODES } from './constants';
import {
    TDBSearchParams,
    TMappedSearchQueryParams,
    TSearchQueryParams,
} from './types';

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

export const getSortDirectionValue = (
    sortDirection: TSearchQueryParams['sortDirection']
) => {
    if (sortDirection === 'asc') {
        return 1;
    } else if (sortDirection === 'desc') {
        return -1;
    }
    return DEFAULT_SEARCH_PARAMS.sortDirection;
};

export const getSearchQueries = (queries: TSearchQueryParams) => {
    const { sortBy, sortDirection, pageNumber, pageSize } = queries;
    const searchQueries: TMappedSearchQueryParams = {
        sortBy: sortBy || DEFAULT_SEARCH_PARAMS.sortBy,
        sortDirection: getSortDirectionValue(sortDirection),
        pageNumber: Number(pageNumber) || DEFAULT_SEARCH_PARAMS.pageNumber,
        pageSize: Number(pageSize) || DEFAULT_SEARCH_PARAMS.pageSize,
    };
    return searchQueries;
};

export const getDBSearchQueries = (
    searchQueries: TMappedSearchQueryParams
): TDBSearchParams => {
    const { sortBy, sortDirection, pageNumber, pageSize } = searchQueries;
    const dbSearchQueries: TDBSearchParams = {
        sortBy,
        sortDirection,
        skip: (pageNumber - 1) * pageSize,
        limit: pageSize ?? 0,
    };
    return dbSearchQueries;
};
