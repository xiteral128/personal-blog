import { createClient } from 'redis';
import { env } from '../../config/env';

export const redisClient = createClient({
  url: env.redisUrl,
});

redisClient.on('error', (error) => {
  console.error('[redis]', error);
});

let connected = false;

export const ensureRedis = async () => {
  if (!connected) {
    await redisClient.connect();
    connected = true;
  }
  return redisClient;
};

export const buildCacheKey = (...parts: Array<string | number>) => {
  return [env.redisPrefix, ...parts].join(':');
};
