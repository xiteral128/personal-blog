import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/appError';
import { authenticateAiKey } from '../../modules/aiWriting/service';

const extractBearerToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  return authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';
};

export const aiAuthMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const token = extractBearerToken(req);

  if (!token) {
    return next(new AppError(401, '缺少AI API Key'));
  }

  try {
    req.aiKey = await authenticateAiKey(token, req.ip);
    return next();
  } catch (error) {
    return next(error);
  }
};
