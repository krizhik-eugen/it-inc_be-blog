import { OptionalUnlessRequiredId } from 'mongodb';
import { db } from '../../db';

export type RateLimiterDBModel = OptionalUnlessRequiredId<{
    IP: string;
    URL: string;
    date: number;
}>;

export type RateLimiterDBSearchParams = {
    IP: string;
    URL: string;
    timeRange: number;
};

export const rateLimiterCollection =
    db.collection<RateLimiterDBModel>('rate_limit');
