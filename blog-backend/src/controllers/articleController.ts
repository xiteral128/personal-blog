import { Request, Response } from 'express';
import { deleteArticle, getArticleForAdmin, getPublishedArticleDetail, likePublishedArticle, listPublishedArticles, saveArticle } from '../modules/article/service';
import { createArticleComment, listArticleComments } from '../modules/comment/service';
import { asyncHandler } from '../shared/utils/asyncHandler';
import { sendNoContent, sendSuccess } from '../shared/utils/response';
import { requireNumber, requireString } from '../shared/utils/validators';
import { writeAuditLog } from '../shared/logger/audit';

export const getArticles = asyncHandler(async (req: Request, res: Response) => {
  const result = await listPublishedArticles(req.query.page, req.query.limit);
  return sendSuccess(res, result);
});

export const getArticleDetail = asyncHandler(async (req: Request, res: Response) => {
  const id = requireNumber(req.params.id, '文章ID');
  const article = await getPublishedArticleDetail(id, {
    traceId: req.traceId,
    ip: req.ip,
    userAgent: req.headers['user-agent']?.toString(),
  });
  return sendSuccess(res, article);
});

export const likeArticle = asyncHandler(async (req: Request, res: Response) => {
  const id = requireNumber(req.params.id, '文章ID');
  await likePublishedArticle(id);
  return sendNoContent(res);
});

export const getComments = asyncHandler(async (req: Request, res: Response) => {
  const articleId = requireNumber(req.query.article_id, 'article_id');
  const comments = await listArticleComments(articleId);
  return sendSuccess(res, comments);
});

export const createComment = asyncHandler(async (req: Request, res: Response) => {
  const articleId = requireNumber(req.body.article_id, 'article_id');
  const nickname = requireString(req.body.nickname, '昵称');
  const email = requireString(req.body.email, '邮箱');
  const content = requireString(req.body.content, '评论内容');
  const parentId = req.body.parent_id ? requireNumber(req.body.parent_id, 'parent_id') : 0;

  const result = await createArticleComment({ articleId, parentId, nickname, email, content });
  return sendSuccess(res, result, '评论已提交，待审核');
});

export const saveArticleHandler = asyncHandler(async (req: Request, res: Response) => {
  const title = requireString(req.body.title, '标题');
  const content = requireString(req.body.content, '内容');
  const id = req.body.id ? requireNumber(req.body.id, '文章ID') : undefined;
  const categoryId = req.body.category_id ? requireNumber(req.body.category_id, '分类ID') : undefined;
  const status = req.body.status !== undefined ? requireNumber(req.body.status, '状态') : undefined;

  const result = await saveArticle({
    id,
    title,
    summary: req.body.summary,
    content,
    categoryId,
    status,
  });

  await writeAuditLog({
    userId: req.user?.id,
    action: result.created ? 'ARTICLE_CREATE' : 'ARTICLE_UPDATE',
    resourceType: 'article',
    resourceId: result.id,
    traceId: req.traceId,
    ip: req.ip,
    metadata: { title, status },
  });

  return sendSuccess(res, { id: result.id }, result.created ? '发布成功' : '更新成功');
});

export const getAdminArticleDetail = asyncHandler(async (req: Request, res: Response) => {
  const id = requireNumber(req.params.id, '文章ID');
  const article = await getArticleForAdmin(id);
  return sendSuccess(res, article);
});

export const deleteArticleHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = requireNumber(req.params.id, '文章ID');
  await deleteArticle(id);
  await writeAuditLog({
    userId: req.user?.id,
    action: 'ARTICLE_DELETE',
    resourceType: 'article',
    resourceId: id,
    traceId: req.traceId,
    ip: req.ip,
  });
  return sendNoContent(res, '删除成功');
});
