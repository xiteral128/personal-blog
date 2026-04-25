import { delCache } from '../../shared/cache/cache';
import { buildCacheKey } from '../../shared/cache/redis';
import { parsePagination } from '../../shared/utils/validators';
import {
  countCommentsByStatus,
  findAllComments,
  findApprovedCommentsByArticleId,
  insertComment,
  removeCommentById,
  updateCommentReviewStatus,
} from './repository';

export const listArticleComments = async (articleId: number) => {
  return findApprovedCommentsByArticleId(articleId);
};

export const createArticleComment = async (input: {
  articleId: number;
  parentId?: number;
  nickname: string;
  email: string;
  content: string;
}) => {
  const commentId = await insertComment({
    articleId: input.articleId,
    parentId: input.parentId ?? 0,
    nickname: input.nickname.trim(),
    email: input.email.trim(),
    content: input.content.trim(),
    status: 0,
  });

  await delCache(buildCacheKey('stats', 'dashboard'));
  return { id: commentId, status: 0 };
};

export const listAdminComments = async (page: unknown, limit: unknown, status?: unknown) => {
  const pagination = parsePagination(page, limit, 20);
  const normalizedStatus = status === undefined || status === '' ? undefined : Number(status);
  return findAllComments(pagination.limit, pagination.offset, normalizedStatus);
};

export const reviewComment = async (id: number, status: number) => {
  await updateCommentReviewStatus(id, status);
  await delCache(buildCacheKey('stats', 'dashboard'));
};

export const deleteComment = async (id: number) => {
  await removeCommentById(id);
  await delCache(buildCacheKey('stats', 'dashboard'));
};

export const getCommentStatusSummary = async () => {
  const rows = await countCommentsByStatus();
  return rows.reduce(
    (acc, row) => {
      if (Number(row.status) === 1) acc.approved = Number(row.total);
      if (Number(row.status) === 0) acc.pending = Number(row.total);
      return acc;
    },
    { approved: 0, pending: 0 }
  );
};
