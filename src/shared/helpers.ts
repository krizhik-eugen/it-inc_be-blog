import { NextFunction, Response, Request } from 'express';
import { checkSchema, Schema, validationResult } from 'express-validator';
import { DEFAULT_SEARCH_PARAMS, HTTP_STATUS_CODES } from '../constants';
import {
    TErrorType,
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

export const createResponseError = (message: string, field = ''): TErrorType =>
    ({
        message,
        field,
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

export const getEmailConfirmationTemplate = (confirmationCode: string) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                margin-top: 20px;
                font-size: 16px;
                color: #fff;
                background-color: #007BFF;
                text-decoration: none;
                border-radius: 4px;
            }
            .button:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Email Confirmation</h2>
            <p>Hello,</p>
            <p>Thank you for registering in our app. Please confirm your email address by clicking the link below:</p>
            <a 
            href="https://fe-blog-platform.com/auth/registration-confirmation?code=${confirmationCode}" 
            class="button">Confirm Email</a>
            <p>If the button above doesn’t work, you can copy and paste the following URL into your browser:</p>
            <p><b>https://fe-blog-platform.com/auth/registration-confirmation?code=${confirmationCode}</b></p>
            <p>Thank you!</p>
        </div>
    </body>
    </html>
`;
