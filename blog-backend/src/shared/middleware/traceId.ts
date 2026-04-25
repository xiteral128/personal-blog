import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';

export const traceIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const traceId = req.headers['x-trace-id']?.toString() || crypto.randomUUID();
  req.traceId = traceId;
  res.setHeader('X-Trace-Id', traceId);
  next();
};
