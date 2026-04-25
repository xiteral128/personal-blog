import { AppError } from '../../shared/errors/appError';
import { getCache, setCache, delCache } from '../../shared/cache/cache';
import { buildCacheKey } from '../../shared/cache/redis';
import { parsePagination } from '../../shared/utils/validators';
import {
  findArticleByIdForAdmin,
  findPublishedArticleById,
  findPublishedArticles,
  flushArticleViewAggregates,
  incrementArticleLikes,
  queueArticleViewLog,
  removeArticleById,
  saveArticleRecord,
} from './repository';

const ARTICLE_LIST_TTL = 300;
const ARTICLE_DETAIL_TTL = 300;

export const listPublishedArticles = async (page: unknown, limit: unknown) => {
  const pagination = parsePagination(page, limit, 10);
  const cacheKey = buildCacheKey('articles', 'list', pagination.page, pagination.limit);
  const cached = await getCache<Awaited<ReturnType<typeof findPublishedArticles>>>(cacheKey);
  if (cached) return cached;

  const result = await findPublishedArticles(pagination.limit, pagination.offset);
  await setCache(cacheKey, result, ARTICLE_LIST_TTL);
  return result;
};

export const getPublishedArticleDetail = async (
  id: number,
  context?: { traceId?: string; ip?: string; userAgent?: string }
) => {
  const cacheKey = buildCacheKey('articles', 'detail', id);
  const cached = await getCache<Awaited<ReturnType<typeof findPublishedArticleById>>>(cacheKey);

  await queueArticleViewLog({
    articleId: id,
    traceId: context?.traceId,
    ip: context?.ip,
    userAgent: context?.userAgent,
  });
  await flushArticleViewAggregates(id);
  await delCache(buildCacheKey('stats', 'dashboard'));

  if (cached) {
    return {
      ...cached,
      views: Number(cached.views) + 1,
      contentPreview: String(cached.content || '').slice(0, 240),
      contentLength: String(cached.content || '').length,
    };
  }

  const article = await findPublishedArticleById(id);
  if (!article) {
    throw new AppError(404, 'Article Not Found');
  }

  await setCache(cacheKey, article, ARTICLE_DETAIL_TTL);
  return {
    ...article,
    contentPreview: String(article.content || '').slice(0, 240),
    contentLength: String(article.content || '').length,
  };
};

export const likePublishedArticle = async (id: number) => {
  const updated = await incrementArticleLikes(id);
  if (!updated) {
    throw new AppError(404, 'Article Not Found');
  }
  await delCache(buildCacheKey('articles', 'detail', id), buildCacheKey('stats', 'dashboard'));
};

export const saveArticle = async (input: {
  id?: number;
  title: string;
  summary?: string;
  content: string;
  categoryId?: number;
  status?: number;
  source?: string;
  aiKeyId?: number | null;
  reviewStatus?: string | null;
  reviewNote?: string | null;
}) => {
  const title = input.title.trim();
  const content = input.content.trim();
  const summary = input.summary?.trim() || title.slice(0, 50);
  const categoryId = input.categoryId ?? 1;
  const existing = input.id ? await findArticleByIdForAdmin(input.id) : null;
  const status = input.status ?? existing?.status ?? 1;

  const result = await saveArticleRecord({
    id: input.id,
    title,
    summary,
    content,
    categoryId,
    status,
    source: input.source,
    aiKeyId: input.aiKeyId,
    reviewStatus: input.reviewStatus,
    reviewNote: input.reviewNote,
  });

  await delCache(
    buildCacheKey('articles', 'detail', result.id),
    buildCacheKey('articles', 'list', 1, 10),
    buildCacheKey('meta', 'categories'),
    buildCacheKey('meta', 'tags'),
    buildCacheKey('stats', 'dashboard')
  );

  return result;
};

export const deleteArticle = async (id: number) => {
  await removeArticleById(id);
  await delCache(
    buildCacheKey('articles', 'detail', id),
    buildCacheKey('articles', 'list', 1, 10),
    buildCacheKey('stats', 'dashboard')
  );
};

export const getArticleForAdmin = async (id: number) => {
  const article = await findArticleByIdForAdmin(id);
  if (!article) {
    throw new AppError(404, 'Article Not Found');
  }
  return {
    ...article,
    contentPreview: String(article.content || '').slice(0, 240),
    contentLength: String(article.content || '').length,
  };
};
