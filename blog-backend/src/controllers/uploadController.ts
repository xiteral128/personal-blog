import { Request, Response } from 'express';
import { buildUploadResponse } from '../modules/upload/service';
import { asyncHandler } from '../shared/utils/asyncHandler';
import { AppError } from '../shared/errors/appError';
import { sendSuccess } from '../shared/utils/response';

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError(400, '请选择要上传的图片');
  }

  return sendSuccess(res, buildUploadResponse(req.file), '上传成功');
});
