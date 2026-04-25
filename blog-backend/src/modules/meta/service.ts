import { getCache, setCache } from '../../shared/cache/cache';
import { buildCacheKey } from '../../shared/cache/redis';
import { findCategories, findTags } from './repository';

export const listCategories = async () => {
  const cacheKey = buildCacheKey('meta', 'categories');
  const cached = await getCache<Awaited<ReturnType<typeof findCategories>>>(cacheKey);
  if (cached) return cached;

  const result = await findCategories();
  await setCache(cacheKey, result, 600);
  return result;
};

export const listTags = async () => {
  const cacheKey = buildCacheKey('meta', 'tags');
  const cached = await getCache<Awaited<ReturnType<typeof findTags>>>(cacheKey);
  if (cached) return cached;

  const result = await findTags();
  await setCache(cacheKey, result, 600);
  return result;
};
