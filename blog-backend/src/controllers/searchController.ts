import { Request, Response } from 'express';
import { asyncHandler } from '../shared/utils/asyncHandler';
import { sendSuccess } from '../shared/utils/response';
import { answerQuestion, getArticleAiAssist, rebuildSearchIndex, semanticSearchArticles, getIndexedChunks } from '../modules/search/service';
import { requireNumber, requireString } from '../shared/utils/validators';

export const rebuildIndex = asyncHandler(async (_req: Request, res: Response) => {
  const result = await rebuildSearchIndex();
  return sendSuccess(res, result, '索引重建完成');
});

export const searchArticles = asyncHandler(async (req: Request, res: Response) => {
  const query = requireString(req.query.q, '搜索关键词');
  const limit = req.query.limit ? requireNumber(req.query.limit, 'limit') : 5;
  const result = await semanticSearchArticles(query, limit);
  return sendSuccess(res, result);
});

export const askQuestion = asyncHandler(async (req: Request, res: Response) => {
  const question = requireString(req.body.question, '问题');
  const result = await answerQuestion(question);
  return sendSuccess(res, result);
});

export const getArticleIndexChunks = asyncHandler(async (req: Request, res: Response) => {
  const articleId = requireNumber(req.params.articleId, 'articleId');
  const chunks = await getIndexedChunks(articleId);
  return sendSuccess(res, chunks);
});

export const getArticleAssist = asyncHandler(async (req: Request, res: Response) => {
  const articleId = requireNumber(req.params.articleId, 'articleId');
  const result = await getArticleAiAssist(articleId);
  return sendSuccess(res, result);
});
