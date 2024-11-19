import { NextFunction, Response, Request } from 'express';
import { validationResult } from 'express-validator';
import { HTTP_STATUS_CODES } from '../../constants';

export const errorAuthValidator = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req).array({ onlyFirstError: true });

    if (errors.length) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
        return;
    }

    next();
};
