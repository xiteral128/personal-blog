import { Request, Response } from 'express';
import { asyncHandler } from '../shared/utils/asyncHandler';
import { sendNoContent, sendSuccess } from '../shared/utils/response';
import { requireNumber } from '../shared/utils/validators';
import {
  approveAiDraft,
  createArticleFromAi,
  disableAiApiKey,
  generateAiApiKey,
  getAiApiKeys,
  getAiArticle,
  getAiDraftsForAdmin,
  getAiWritingMeta,
  rejectAiDraft,
  rotateAiApiKey,
  updateArticleFromAi,
} from '../modules/aiWriting/service';

export const createAiKey = asyncHandler(async (req: Request, res: Response) => {
  const result = await generateAiApiKey({
    name: req.body.name,
    mode: req.body.mode,
    dailyLimit: req.body.daily_limit,
    expiresAt: req.body.expires_at,
    createdBy: req.user?.id,
    traceId: req.traceId,
    ip: req.ip,
  });
  return sendSuccess(res, result, 'AI API Key创建成功', 201);
});

export const listAiKeys = asyncHandler(async (_req: Request, res: Response) => {
  const result = await getAiApiKeys();
  return sendSuccess(res, result);
});

export const revokeAiKey = asyncHandler(async (req: Request, res: Response) => {
  const id = requireNumber(req.params.id, 'AI Key ID');
  await disableAiApiKey(id, { userId: req.user?.id, traceId: req.traceId, ip: req.ip });
  return sendNoContent(res, 'AI API Key已吊销');
});

export const rotateAiKey = asyncHandler(async (req: Request, res: Response) => {
  const id = requireNumber(req.params.id, 'AI Key ID');
  const result = await rotateAiApiKey(id, { userId: req.user?.id, traceId: req.traceId, ip: req.ip });
  return sendSuccess(res, result, 'AI API Key已重置');
});

export const listAdminAiDrafts = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAiDraftsForAdmin(req.query.status);
  return sendSuccess(res, result);
});

export const approveAdminAiDraft = asyncHandler(async (req: Request, res: Response) => {
  const id = requireNumber(req.params.id, '文章ID');
  const result = await approveAiDraft({
    id,
    publish: Boolean(req.body.publish),
    userId: req.user?.id,
    traceId: req.traceId,
    ip: req.ip,
  });
  return sendSuccess(res, result, 'AI草稿已通过');
});

export const rejectAdminAiDraft = asyncHandler(async (req: Request, res: Response) => {
  const id = requireNumber(req.params.id, '文章ID');
  const result = await rejectAiDraft({
    id,
    note: req.body.note,
    userId: req.user?.id,
    traceId: req.traceId,
    ip: req.ip,
  });
  return sendSuccess(res, result, 'AI草稿已驳回');
});

export const createAiArticle = asyncHandler(async (req: Request, res: Response) => {
  const result = await createArticleFromAi({
    key: req.aiKey!,
    title: req.body.title,
    summary: req.body.summary,
    content: req.body.content,
    categoryId: req.body.category_id,
    status: req.body.status,
    traceId: req.traceId,
    ip: req.ip,
  });
  return sendSuccess(res, result, 'AI文章已接收', 201);
});

export const updateAiArticle = asyncHandler(async (req: Request, res: Response) => {
  const id = requireNumber(req.params.id, '文章ID');
  const result = await updateArticleFromAi({
    id,
    key: req.aiKey!,
    title: req.body.title,
    summary: req.body.summary,
    content: req.body.content,
    categoryId: req.body.category_id,
    status: req.body.status,
    traceId: req.traceId,
    ip: req.ip,
  });
  return sendSuccess(res, result, 'AI文章已更新');
});

export const getAiArticleDetail = asyncHandler(async (req: Request, res: Response) => {
  const id = requireNumber(req.params.id, '文章ID');
  const result = await getAiArticle(id, req.aiKey!.id);
  return sendSuccess(res, result);
});

export const getAiMeta = asyncHandler(async (_req: Request, res: Response) => {
  const result = await getAiWritingMeta();
  return sendSuccess(res, result);
});
