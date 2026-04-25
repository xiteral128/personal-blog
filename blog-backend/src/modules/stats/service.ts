import { getCache, setCache } from '../../shared/cache/cache';
import { buildCacheKey } from '../../shared/cache/redis';
import { listRecentOperationLogs } from '../ops/service';
import { getArticleStats, getCategoryStats, getCommentPendingStats, getCommentStats, getRecentViewTrend } from './repository';

const buildLast7Days = () => {
  const result: string[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    result.push(date.toISOString().slice(0, 10));
  }
  return result;
};

export const getDashboardOverview = async () => {
  const cacheKey = buildCacheKey('stats', 'dashboard');
  const cached = await getCache<{
    totalArticles: number;
    totalViews: number;
    totalInteractions: number;
    pendingComments: number;
    categoryData: unknown[];
    viewTrend: Array<{ day: string; views: number }>;
    recentOperations: unknown[];
  }>(cacheKey);

  if (cached) return cached;

  const [articleStats, commentStats, pendingStats, categoryStats, rawTrend, recentOperations] = await Promise.all([
    getArticleStats(),
    getCommentStats(),
    getCommentPendingStats(),
    getCategoryStats(),
    getRecentViewTrend(),
    listRecentOperationLogs(10),
  ]);

  const trendMap = new Map(rawTrend.map((item) => [String(item.day), Number(item.views)]));
  const viewTrend = buildLast7Days().map((day) => ({ day, views: trendMap.get(day) || 0 }));

  const result = {
    totalArticles: Number(articleStats.total_articles),
    totalViews: Number(articleStats.total_views),
    totalInteractions: Number(articleStats.total_likes) + Number(commentStats.total_comments),
    pendingComments: Number(pendingStats.pending_comments),
    categoryData: categoryStats,
    viewTrend,
    recentOperations,
  };

  await setCache(cacheKey, result, 180);
  return result;
};
