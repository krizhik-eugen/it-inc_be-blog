import { injectable } from 'inversify';
import {
    RateLimiterDBModel,
    RateLimiterDBSearchParams,
    RateLimiterModel,
} from '../models/rate-limiter-model';

@injectable()
export class RateLimiterRepository {
    async registerRequest({ ip, url, date }: RateLimiterDBModel) {
        const result = await RateLimiterModel.create({ ip, url, date });
        return result.id;
    }

    async getRequestsCount({ ip, url, timeRange }: RateLimiterDBSearchParams) {
        const now = Date.now();
        const startingTime = now - timeRange * 1000;
        const result = await RateLimiterModel.countDocuments({
            ip,
            url,
        })
            .where('date')
            .gte(startingTime)
            .lte(now);
        return result;
    }

    async clearRateLimiter() {
        const result = await RateLimiterModel.deleteMany({});
        return result.deletedCount || 0;
    }
}
