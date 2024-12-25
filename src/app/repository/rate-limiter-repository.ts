import {
    rateLimiterCollection,
    RateLimiterDBModel,
    RateLimiterDBSearchParams,
} from '../model';

export const rateLimiterRepository = {
    async registerRequest(request: RateLimiterDBModel) {
        const result = await rateLimiterCollection.insertOne(request);
        return result.insertedId.toString();
    },

    async getRequestsCount({ IP, URL, timeRange }: RateLimiterDBSearchParams) {
        const now = Date.now();
        const startingTime = now - timeRange * 1000;
        return await rateLimiterCollection.countDocuments({
            IP,
            URL,
            date: { $gte: startingTime, $lte: now },
        });
    },

    async clearRateLimiter() {
        await rateLimiterCollection.deleteMany({});
    },
};
