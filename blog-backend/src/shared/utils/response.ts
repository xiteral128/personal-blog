import { Response } from 'express';

export const sendSuccess = <T>(res: Response, data: T, message = 'success', status = 200) => {
  return res.status(status).json({
    code: status,
    message,
    data,
    traceId: res.req.traceId,
  });
};

export const sendNoContent = (res: Response, message = 'success') => {
  return res.status(200).json({
    code: 200,
    message,
    data: null,
    traceId: res.req.traceId,
  });
};
