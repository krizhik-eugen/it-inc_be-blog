import { model, Schema } from 'mongoose';

export interface RateLimiterDBModel {
    ip: string;
    url: string;
    date: number;
}

export type RateLimiterDBSearchParams = {
    ip: string;
    url: string;
    timeRange: number;
};

const RateLimiterSchema = new Schema<RateLimiterDBModel>({
    ip: String,
    url: String,
    date: Number,
});

export const RateLimiterModel = model('rate_limiter', RateLimiterSchema);
