import { rateLimiterTimeWindow } from '../../configs';
import { rateLimiterRepository } from '../../repositories';

export const rateLimiterService = {
    async registerRequest(ip: string, url: string) {
        await rateLimiterRepository.registerRequest({
            ip,
            url,
            date: Date.now(),
        });
    },

    async getRequestsCount(ip: string, url: string) {
        return await rateLimiterRepository.getRequestsCount({
            ip,
            url,
            timeRange: rateLimiterTimeWindow,
        });
    },
};
