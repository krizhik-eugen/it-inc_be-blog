import { RateLimiterRepository } from './repositories';
import { RateLimiterService } from './services';

const rateLimiterRepository = new RateLimiterRepository();

export const rateLimiterService = new RateLimiterService(rateLimiterRepository);
