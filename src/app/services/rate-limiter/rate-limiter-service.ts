import { rateLimiterTimeWindow } from '../../configs';
import { RateLimiterRepository } from '../../repositories';

export class RateLimiterService {
    constructor(protected rateLimiterRepository: RateLimiterRepository) {}

    async registerRequest(ip: string, url: string) {
        await this.rateLimiterRepository.registerRequest({
            ip,
            url,
            date: Date.now(),
        });
    }

    async getRequestsCount(ip: string, url: string) {
        return await this.rateLimiterRepository.getRequestsCount({
            ip,
            url,
            timeRange: rateLimiterTimeWindow,
        });
    }
}
