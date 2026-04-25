import crypto from 'crypto';
import { AppError } from '../../shared/errors/appError';
import { delCache } from '../../shared/cache/cache';
import { buildCacheKey } from '../../shared/cache/redis';
import { writeAuditLog } from '../../shared/logger/audit';
import { createArticleVersion } from '../article/repository';
import { listCategories, listTags } from '../meta/service';
import {
  AiApiKeyRow,
  AiKeyMode,
  countAiArticlesCreatedToday,
  createAiApiKey,
  findAiApiKeyById,
  findAiApiKeyByHash,
  findAiArticleById,
  insertAiArticle,
  insertAiCallLog,
  listAiApiKeys,
  listAiCallLogs,
  listAiDrafts,
  reviewAiDraft,
  revokeAiApiKey,
  touchAiApiKey,
  updateAiApiKeySecret,
  updateAiArticle,
} from './repository';

const TOKEN_PREFIX = 'blog_ai_';
const MAX_TITLE_LENGTH = 100;
const MAX_SUMMARY_LENGTH = 300;
const MAX_CONTENT_LENGTH = 100 * 1024;

const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

const createToken = () => `${TOKEN_PREFIX}${crypto.randomBytes(32).toString('base64url')}`;

const normalizeMode = (mode: unknown): AiKeyMode => {
  return mode === 'autonomous' ? 'autonomous' : 'review';
};

const normalizeDailyLimit = (value: unknown) => {
  const limit = Number(value);
  if (!Number.isFinite(limit)) return 20;
  return Math.max(1, Math.min(100, Math.floor(limit)));
};

const cleanText = (value: unknown, field: string, maxLength: number) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new AppError(400, `${field}不能为空`);
  }
  const text = value.trim();
  if (text.length > maxLength) {
    throw new AppError(400, `${field}不能超过${maxLength}个字符`);
  }
  return text;
};

const cleanOptionalText = (value: unknown, fallback: string, maxLength: number) => {
  if (typeof value !== 'string' || !value.trim()) return fallback.slice(0, maxLength);
  return value.trim().slice(0, maxLength);
};

const normalizeCategoryId = (value: unknown) => {
  const categoryId = Number(value);
  if (!Number.isFinite(categoryId) || categoryId <= 0) return 1;
  return Math.floor(categoryId);
};

const resolveAiStatus = (mode: AiKeyMode, status: unknown) => {
  if (mode === 'review') {
    return { status: 2, reviewStatus: 'pending' };
  }

  const desiredStatus = Number(status);
  if (desiredStatus === 0) {
    return { status: 0, reviewStatus: 'approved' };
  }
  return { status: 1, reviewStatus: 'approved' };
};

const clearArticleCaches = async (id: number) => {
  await delCache(
    buildCacheKey('articles', 'detail', id),
    buildCacheKey('articles', 'list', 1, 10),
    buildCacheKey('stats', 'dashboard')
  );
};

export const generateAiApiKey = async (input: {
  name: unknown;
  mode: unknown;
  dailyLimit: unknown;
  expiresAt?: unknown;
  createdBy?: number;
  traceId?: string;
  ip?: string;
}) => {
  const name = cleanText(input.name, 'Agent名称', 100);
  const token = createToken();
  const keyPrefix = token.slice(0, 18);
  const mode = normalizeMode(input.mode);
  const dailyLimit = normalizeDailyLimit(input.dailyLimit);
  const expiresAt = typeof input.expiresAt === 'string' && input.expiresAt.trim() ? input.expiresAt.trim() : null;

  const id = await createAiApiKey({
    name,
    keyPrefix,
    keyHash: hashToken(token),
    mode,
    dailyLimit,
    expiresAt,
    createdBy: input.createdBy,
  });

  await writeAuditLog({
    userId: input.createdBy,
    action: 'AI_KEY_CREATE',
    resourceType: 'ai_api_key',
    resourceId: id,
    traceId: input.traceId,
    ip: input.ip,
    metadata: { name, mode, dailyLimit, keyPrefix },
  });

  return {
    id,
    apiKey: token,
    keyPrefix,
    name,
    mode,
    dailyLimit,
    expiresAt,
  };
};

export const rotateAiApiKey = async (id: number, context?: { userId?: number; traceId?: string; ip?: string }) => {
  const key = await findAiApiKeyById(id);
  if (!key) throw new AppError(404, 'AI Key not found');

  const token = createToken();
  const keyPrefix = token.slice(0, 18);
  await updateAiApiKeySecret({
    id,
    keyPrefix,
    keyHash: hashToken(token),
  });

  await writeAuditLog({
    userId: context?.userId,
    action: 'AI_KEY_ROTATE',
    resourceType: 'ai_api_key',
    resourceId: id,
    traceId: context?.traceId,
    ip: context?.ip,
    metadata: { name: key.name, mode: key.mode, keyPrefix },
  });

  return {
    id,
    apiKey: token,
    keyPrefix,
    name: key.name,
    mode: key.mode,
    enabled: true,
    dailyLimit: key.daily_limit,
    lastUsedAt: key.last_used_at,
    lastUsedIp: key.last_used_ip,
    expiresAt: key.expires_at,
    createdAt: key.created_at,
    revokedAt: null,
  };
};

export const getAiApiKeys = async () => {
  const rows = await listAiApiKeys();
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    keyPrefix: row.key_prefix,
    mode: row.mode,
    enabled: Boolean(row.enabled),
    dailyLimit: row.daily_limit,
    lastUsedAt: row.last_used_at,
    lastUsedIp: row.last_used_ip,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    revokedAt: row.revoked_at,
  }));
};

export const recordAiCall = async (input: {
  aiKeyId?: number | null;
  agentName?: string | null;
  method: string;
  path: string;
  statusCode: number;
  latencyMs: number;
  requestBytes: number;
  ip?: string | null;
  userAgent?: string | null;
  traceId?: string | null;
}) => {
  await insertAiCallLog({
    ...input,
    success: input.statusCode < 400,
  });
};

export const getAiCallLogsForAdmin = async (limit?: unknown) => {
  const parsedLimit = limit === undefined || limit === '' ? 100 : Number(limit);
  return listAiCallLogs(Number.isFinite(parsedLimit) ? parsedLimit : 100);
};

export const disableAiApiKey = async (id: number, context?: { userId?: number; traceId?: string; ip?: string }) => {
  const ok = await revokeAiApiKey(id);
  if (!ok) throw new AppError(404, 'AI Key不存在');

  await writeAuditLog({
    userId: context?.userId,
    action: 'AI_KEY_REVOKE',
    resourceType: 'ai_api_key',
    resourceId: id,
    traceId: context?.traceId,
    ip: context?.ip,
  });
};

export const authenticateAiKey = async (token: string, ip?: string) => {
  if (!token.startsWith(TOKEN_PREFIX)) {
    throw new AppError(401, 'AI API Key无效');
  }

  const key = await findAiApiKeyByHash(hashToken(token));
  if (!key || !key.enabled || key.revoked_at) {
    throw new AppError(401, 'AI API Key无效或已禁用');
  }

  if (key.expires_at && new Date(key.expires_at).getTime() < Date.now()) {
    throw new AppError(401, 'AI API Key已过期');
  }

  await touchAiApiKey(key.id, ip);
  return {
    id: key.id,
    name: key.name,
    mode: key.mode,
    dailyLimit: key.daily_limit,
  };
};

const ensureDailyLimit = async (key: Pick<AiApiKeyRow, 'id' | 'daily_limit'> | { id: number; dailyLimit: number }) => {
  const limit = 'daily_limit' in key ? key.daily_limit : key.dailyLimit;
  const used = await countAiArticlesCreatedToday(key.id);
  if (used >= limit) {
    throw new AppError(429, `今日创建文章数已达到上限：${limit}`);
  }
};

export const createArticleFromAi = async (input: {
  key: { id: number; name: string; mode: AiKeyMode; dailyLimit: number };
  title: unknown;
  summary?: unknown;
  content: unknown;
  categoryId?: unknown;
  status?: unknown;
  traceId?: string;
  ip?: string;
}) => {
  await ensureDailyLimit(input.key);

  const title = cleanText(input.title, '标题', MAX_TITLE_LENGTH);
  const content = cleanText(input.content, '内容', MAX_CONTENT_LENGTH);
  const summary = cleanOptionalText(input.summary, title, MAX_SUMMARY_LENGTH);
  const categoryId = normalizeCategoryId(input.categoryId);
  const resolved = resolveAiStatus(input.key.mode, input.status);

  const id = await insertAiArticle({
    title,
    summary,
    content,
    categoryId,
    status: resolved.status,
    keyId: input.key.id,
    reviewStatus: resolved.reviewStatus,
  });

  await clearArticleCaches(id);
  await writeAuditLog({
    action: 'AI_ARTICLE_CREATE',
    resourceType: 'article',
    resourceId: id,
    traceId: input.traceId,
    ip: input.ip,
    metadata: { aiKeyId: input.key.id, agent: input.key.name, mode: input.key.mode, status: resolved.status },
  });

  return { id, status: resolved.status, reviewStatus: resolved.reviewStatus };
};

export const updateArticleFromAi = async (input: {
  id: number;
  key: { id: number; name: string; mode: AiKeyMode; dailyLimit: number };
  title: unknown;
  summary?: unknown;
  content: unknown;
  categoryId?: unknown;
  status?: unknown;
  traceId?: string;
  ip?: string;
}) => {
  const existing = await findAiArticleById(input.id, input.key.id);
  if (!existing) throw new AppError(404, 'AI文章不存在或无权修改');

  const title = cleanText(input.title, '标题', MAX_TITLE_LENGTH);
  const content = cleanText(input.content, '内容', MAX_CONTENT_LENGTH);
  const summary = cleanOptionalText(input.summary, title, MAX_SUMMARY_LENGTH);
  const categoryId = normalizeCategoryId(input.categoryId);
  const resolved = resolveAiStatus(input.key.mode, input.status);

  await createArticleVersion({
    article: existing,
    snapshotType: 'ai_update',
  });

  const ok = await updateAiArticle({
    id: input.id,
    keyId: input.key.id,
    title,
    summary,
    content,
    categoryId,
    status: resolved.status,
    reviewStatus: resolved.reviewStatus,
  });
  if (!ok) throw new AppError(404, 'AI文章不存在或无权修改');

  await clearArticleCaches(input.id);
  await writeAuditLog({
    action: 'AI_ARTICLE_UPDATE',
    resourceType: 'article',
    resourceId: input.id,
    traceId: input.traceId,
    ip: input.ip,
    metadata: { aiKeyId: input.key.id, agent: input.key.name, mode: input.key.mode, status: resolved.status },
  });

  return { id: input.id, status: resolved.status, reviewStatus: resolved.reviewStatus };
};

export const getAiArticle = async (id: number, keyId: number) => {
  const article = await findAiArticleById(id, keyId);
  if (!article) throw new AppError(404, 'AI文章不存在或无权查看');
  return article;
};

export const getAiWritingMeta = async () => {
  const [categories, tags] = await Promise.all([listCategories(), listTags()]);
  return { categories, tags };
};

export const getAiDraftsForAdmin = async (status?: unknown) => {
  const parsedStatus = status === undefined || status === '' ? undefined : Number(status);
  if (parsedStatus !== undefined && !Number.isFinite(parsedStatus)) {
    throw new AppError(400, '状态格式不正确');
  }
  return listAiDrafts(parsedStatus);
};

export const approveAiDraft = async (input: {
  id: number;
  publish?: unknown;
  userId?: number;
  traceId?: string;
  ip?: string;
}) => {
  const status = input.publish ? 1 : 0;
  const ok = await reviewAiDraft({
    id: input.id,
    status,
    reviewStatus: 'approved',
    reviewedBy: input.userId,
  });
  if (!ok) throw new AppError(404, 'AI草稿不存在');

  await clearArticleCaches(input.id);
  await writeAuditLog({
    userId: input.userId,
    action: status === 1 ? 'AI_DRAFT_APPROVE_PUBLISH' : 'AI_DRAFT_APPROVE_DRAFT',
    resourceType: 'article',
    resourceId: input.id,
    traceId: input.traceId,
    ip: input.ip,
  });

  return { id: input.id, status };
};

export const rejectAiDraft = async (input: {
  id: number;
  note?: unknown;
  userId?: number;
  traceId?: string;
  ip?: string;
}) => {
  const note = typeof input.note === 'string' ? input.note.trim().slice(0, 500) : '';
  const ok = await reviewAiDraft({
    id: input.id,
    status: 3,
    reviewStatus: 'rejected',
    reviewNote: note || null,
    reviewedBy: input.userId,
  });
  if (!ok) throw new AppError(404, 'AI草稿不存在');

  await clearArticleCaches(input.id);
  await writeAuditLog({
    userId: input.userId,
    action: 'AI_DRAFT_REJECT',
    resourceType: 'article',
    resourceId: input.id,
    traceId: input.traceId,
    ip: input.ip,
    metadata: { note },
  });

  return { id: input.id, status: 3 };
};
