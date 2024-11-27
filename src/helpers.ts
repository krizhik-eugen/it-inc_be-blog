import { NextFunction, Response, Request } from 'express';
import { checkSchema, Schema, validationResult } from 'express-validator';
import { HTTP_STATUS_CODES } from './constants';

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

export const requestValidator = (
    {
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

export const getSearchParams = (req: Request<>) => {
    const { sortBy, sortDirection, pageNumber, pageSize } =
        req.query;
    return {
        sortBy: sortBy || 'createdAt',
        sortDirection: sortDirection || 'desc',
        pageNumber: pageNumber || 1,
        pageSize: pageSize || 10,
    };
};