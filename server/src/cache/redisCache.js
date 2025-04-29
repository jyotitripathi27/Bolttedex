// Sets up Redis client and provides utility functions to save and retrieve cached data.

import Redis from 'ioredis';

let redisClient;
const redisTTL = process.env.REDIS_TTL;
try {
    redisClient = new Redis({
        port: `${process.env.REDIS_PORT}`,
        host: `${process.env.REDIS_HOST}`,
        username: `${process.env.REDIS_USERNAME}`,
        password: `${process.env.REDIS_PASSWORD}`,
        db: `${process.env.REDIS_DB}`
    });
    
    redisClient.on('error', (err) => {
        console.error('Redis client error:', err);
        redisClient = null;
    });

    redisClient.on('connect', () => {
        console.log('Connected to Redis');
    });
} catch (err) {
    console.error('Redis not available');
    redisClient = null;
}

const saveToCache = async (key, value) => {
    if (redisClient) {
        await redisClient.set(key, JSON.stringify(value), "EX", redisTTL);
    } else {
        console.error('Redis is unavailable, data cannot be cached');
    }
};

const getFromCache = async (key) => {
    if (redisClient) {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } else {
        console.error('Redis is unavailable, data cannot be retrieved');
        return null;
    }
};

export { getFromCache, saveToCache };
