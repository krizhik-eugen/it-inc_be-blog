import { EmailManager } from './managers';
import { RateLimiterRepository } from './repositories';
import { JwtService } from './services';
import { RateLimiterService } from './services';

export const rateLimiterRepository = new RateLimiterRepository();

export const rateLimiterService = new RateLimiterService(rateLimiterRepository);

export const jwtService = new JwtService();

export const emailManager = new EmailManager();
