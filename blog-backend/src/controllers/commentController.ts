import { Request, Response } from 'express';
import { deleteComment, getCommentStatusSummary, listAdminComments, reviewComment } from '../modules/comment/service';
import { asyncHandler } from '../shared/utils/asyncHandler';
import { sendNoContent, sendSuccess } from '../shared/utils/response';
import { requireNumber } from '../shared/utils/validators';
import { writeAuditLog } from '../shared/logger/audit';

export const getAllComments = asyncHandler(async (req: Request, res: Response) => {
  const comments = await listAdminComments(req.query.page, req.query.limit, req.query.status);
  const summary = await getCommentStatusSummary();
  return sendSuccess(res, { list: comments, summary });
});

export const updateCommentStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = requireNumber(req.params.id, '评论ID');
  const status = requireNumber(req.body.status, '状态');
  await reviewComment(id, status);
  await writeAuditLog({
    userId: req.user?.id,
    action: status === 1 ? 'COMMENT_APPROVE' : 'COMMENT_REJECT',
    resourceType: 'comment',
    resourceId: id,
    traceId: req.traceId,
    ip: req.ip,
    metadata: { status },
  });
  return sendNoContent(res, '更新成功');
});

export const deleteCommentHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = requireNumber(req.params.id, '评论ID');
  await deleteComment(id);
  await writeAuditLog({
    userId: req.user?.id,
    action: 'COMMENT_DELETE',
    resourceType: 'comment',
    resourceId: id,
    traceId: req.traceId,
    ip: req.ip,
  });
  return sendNoContent(res, '删除成功');
});
