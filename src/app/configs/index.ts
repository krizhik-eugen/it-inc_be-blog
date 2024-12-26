import { baseRoutes, routersPaths } from './routes-config';
import {
    accessTokenExpirationTime,
    getCodeExpirationDate,
    hashSaltRounds,
    jwtSecret,
    mongoDBName,
    mongoDBUrl,
    port,
    rateLimiterMaxRequests,
    rateLimiterTimeWindow,
    refreshTokenExpirationTime,
} from './app-config';

export {
    baseRoutes,
    port,
    routersPaths,
    mongoDBUrl,
    mongoDBName,
    jwtSecret,
    accessTokenExpirationTime,
    refreshTokenExpirationTime,
    getCodeExpirationDate,
    hashSaltRounds,
    rateLimiterTimeWindow,
    rateLimiterMaxRequests,
};
