import { config } from 'dotenv';

config();

export const port = process.env.PORT ?? 3000;

export const mongoDBUrl = process.env.MONGO_URL ?? 'mongodb://localhost:27017';
export const mongoDBName = process.env.MONGO_NAME ?? 'mongo_test';
