import { OptionalUnlessRequiredId } from 'mongodb';
import { db } from '../../../db';

export type RateLimiterDBModel = OptionalUnlessRequiredId<{
    ip: string;
    url: string;
    date: number;
}>;

export type RateLimiterDBSearchParams = {
    ip: string;
    url: string;
    timeRange: number;
};

export const rateLimiterCollection =
    db.collection<RateLimiterDBModel>('rate_limit');
