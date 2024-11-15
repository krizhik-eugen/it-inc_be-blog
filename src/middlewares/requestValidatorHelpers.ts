import { NextFunction, Response, Request } from 'express';
import { checkSchema, Schema, validationResult } from 'express-validator';
import { HTTP_STATUS_CODES } from '../constants';

export const errorValidator = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req).array({ onlyFirstError: true });

    if (errors.length) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            errorMessages: errors.map((error) => ({
                message: error.msg,
                field: error.type === 'field' ? error.path : '',
            })),
        });
        return;
    }

    next();
};

export const requestValidator = (bodySchema: Schema, paramSchema?: Schema) => {
    const schema: Schema = {
        ...bodySchema,
        ...(paramSchema || {}),
    };

    const scopes: Parameters<typeof checkSchema>[1] = paramSchema
        ? ['body', 'params']
        : ['body'];

    return [checkSchema(schema, scopes), errorValidator];
};
