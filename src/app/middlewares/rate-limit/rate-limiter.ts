import { Request, Response, NextFunction } from 'express';
import { rateLimiterRepository } from '../../repository';
import { HTTP_STATUS_CODES } from '../../../constants';
import { createResponseError } from '../../../shared/helpers';

export const rateLimiter = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const IP = req.ip!;
    const URL = req.originalUrl;
    const timeRange = 10;
    await rateLimiterRepository.registerRequest({ IP, URL, date: Date.now() });
    const requestsCount = await rateLimiterRepository.getRequestsCount({
        IP,
        URL,
        timeRange,
    });

    if (requestsCount > 5) {
        res.status(HTTP_STATUS_CODES.TOO_MANY_REQUESTS).json({
            errorsMessages: [createResponseError('Too many requests')],
        });
        return;
    }
    next();
};
