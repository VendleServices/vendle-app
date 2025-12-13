import IORedis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

export const redis = new IORedis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
});
