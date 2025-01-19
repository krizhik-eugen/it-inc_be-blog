import { Request, Response, NextFunction } from 'express';
import { rateLimiterMaxRequests } from '../configs/app-config';
import { HTTP_STATUS_CODES } from '../../constants';
import { createResponseError } from '../../shared/helpers';
import { container } from '../../app-composition-root';
import { RateLimiterService } from '../services/rate-limiter-service';

const rateLimiterService = container.get(RateLimiterService);

export const rateLimiter = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const ip = req.ip!;
    const url = req.originalUrl;

    await rateLimiterService.registerRequest(ip, url);
    const requestsCount = await rateLimiterService.getRequestsCount(ip, url);
    if (requestsCount > rateLimiterMaxRequests) {
        res.status(HTTP_STATUS_CODES.TOO_MANY_REQUESTS).json({
            errorsMessages: [createResponseError('Too many requests')],
        });
        return;
    }
    next();
};
