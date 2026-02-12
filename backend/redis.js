import IORedis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redisOptions = {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy: (times) => {
        if (times > 3) {
            console.error('Redis connection failed after 3 retries');
            return null; // Stop retrying
        }
        return Math.min(times * 200, 2000);
    }
};

export const redis = process.env.REDIS_URL
    ? new IORedis(process.env.REDIS_URL, redisOptions)
    : new IORedis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || undefined,
        ...redisOptions
    });

redis.on('error', (err) => {
    console.error('Redis connection error:', err.message);
});

redis.on('connect', () => {
    console.log('Redis connected successfully');
});
