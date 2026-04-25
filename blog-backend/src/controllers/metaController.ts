import { Request, Response } from 'express';
import { listCategories, listTags } from '../modules/meta/service';
import { asyncHandler } from '../shared/utils/asyncHandler';
import { sendSuccess } from '../shared/utils/response';

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const rows = await listCategories();
  return sendSuccess(res, rows);
});

export const getTags = asyncHandler(async (_req: Request, res: Response) => {
  const rows = await listTags();
  return sendSuccess(res, rows);
});
