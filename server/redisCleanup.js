// This is the script which can be utilized to cleanup redis db at the time of development for changes and testing
import Redis from 'ioredis';

let redisClient;
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

    await cleanupAllKeys();
} catch (err) {
    console.error('Redis not available');
    redisClient = null;
}

async function cleanupAllKeys() {
    try {
        const keys = await redisClient.keys('*');
        let opsCount = 0;
        for(const key of keys) {
            await redisClient.del(key);
            opsCount++;
        }
        console.log(`Deleted ${opsCount} keys`);
    } catch(err) {
        console.error('Error during cleanup:', err);
    } finally {
        await redisClient.quit();
        console.log('Connection closed.');
    }
}
