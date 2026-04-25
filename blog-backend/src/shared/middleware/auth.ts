import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/appError';
import { getCurrentSessionUser } from '../../modules/auth/service';

const extractBearerToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  return authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';
};

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const token = extractBearerToken(req);

  if (!token) {
    return next(new AppError(401, '未授权，请先登录'));
  }

  try {
    req.user = await getCurrentSessionUser(token);
    return next();
  } catch (error) {
    return next(error);
  }
};

export const getRequestAccessToken = extractBearerToken;
