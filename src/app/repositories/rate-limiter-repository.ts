import {
    rateLimiterCollection,
    RateLimiterDBModel,
    RateLimiterDBSearchParams,
} from '../models/rate-limiter';

export const rateLimiterRepository = {
    async registerRequest({ ip, url, date }: RateLimiterDBModel) {
        const result = await rateLimiterCollection.insertOne({ ip, url, date });
        return result.insertedId.toString();
    },

    async getRequestsCount({ ip, url, timeRange }: RateLimiterDBSearchParams) {
        const now = Date.now();
        const startingTime = now - timeRange * 1000;
        return await rateLimiterCollection.countDocuments({
            ip,
            url,
            date: { $gte: startingTime, $lte: now },
        });
    },

    async clearRateLimiter() {
        await rateLimiterCollection.deleteMany({});
    },
};
