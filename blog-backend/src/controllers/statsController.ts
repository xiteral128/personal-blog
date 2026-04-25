import { Request, Response } from 'express';
import { getDashboardOverview } from '../modules/stats/service';
import { asyncHandler } from '../shared/utils/asyncHandler';
import { sendSuccess } from '../shared/utils/response';

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const data = await getDashboardOverview();
  return sendSuccess(res, {
    ...data,
    traceId: req.traceId,
  });
});
