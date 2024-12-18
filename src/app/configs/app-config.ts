import { config } from 'dotenv';

config();

export const port = process.env.PORT ?? 3000;

export const mongoDBUrl = process.env.MONGO_URL ?? 'mongodb://localhost:27017';
export const mongoDBName = process.env.MONGO_NAME ?? 'mongo_test';
export const jwtSecret = process.env.JWT_SECRET ?? 'secret';
export const appDeploymentURL =
    process.env.APP_DEPLOYMENT_URL ?? `http://localhost:${port}`;
export const hostEmailLogin = process.env.HOST_EMAIL_LOGIN;
export const hostEmailPassword = process.env.HOST_EMAIL_PASSWORD;
