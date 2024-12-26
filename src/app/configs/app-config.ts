import { config } from 'dotenv';
import { add } from 'date-fns';

config();

export const port = process.env.PORT ?? 3000;
export const mongoDBUrl = process.env.MONGO_URL ?? 'mongodb://localhost:27017';
export const mongoDBName = process.env.MONGO_NAME ?? 'mongo_test';
export const jwtSecret = process.env.JWT_SECRET ?? 'secret';
export const appDeploymentURL =
    process.env.APP_DEPLOYMENT_URL ?? `http://localhost:${port}`;
export const hostEmailLogin = process.env.HOST_EMAIL_LOGIN;
export const hostEmailPassword = process.env.HOST_EMAIL_PASSWORD;
export const hashSaltRounds = 10;
export const accessTokenExpirationTime = 10;
export const refreshTokenExpirationTime = 20;
export const rateLimiterTimeWindow = 10; //min
export const rateLimiterMaxRequests = 5;
export const getCodeExpirationDate = () => {
    return add(new Date(), { hours: 1 });
};
