import { ensureRedis } from './redis';

export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const client = await ensureRedis();
    const value = await client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    console.error('[cache:get]', key, error);
    return null;
  }
};

export const setCache = async (key: string, value: unknown, ttlSeconds: number) => {
  try {
    const client = await ensureRedis();
    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (error) {
    console.error('[cache:set]', key, error);
  }
};

export const delCache = async (...keys: string[]) => {
  if (!keys.length) return;
  try {
    const client = await ensureRedis();
    await client.del(keys);
  } catch (error) {
    console.error('[cache:del]', keys, error);
  }
};
