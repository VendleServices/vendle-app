import IORedis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redisOptions = {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
};

export const redis = process.env.REDIS_URL
    ? new IORedis(process.env.REDIS_URL, redisOptions)
    : new IORedis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || undefined,
        ...redisOptions
    });
