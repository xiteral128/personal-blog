import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/appError';

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ code: 404, message: 'API Not Found', data: null, traceId: req.traceId });
};

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      data: null,
      details: err.details,
      traceId: req.traceId,
    });
  }

  console.error(`[${req.traceId || 'no-trace'}]`, err);
  return res.status(500).json({
    code: 500,
    message: 'Internal Server Error',
    data: null,
    traceId: req.traceId,
  });
};
