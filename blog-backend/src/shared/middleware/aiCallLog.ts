import { NextFunction, Request, Response } from 'express';
import { recordAiCall } from '../../modules/aiWriting/service';

const getRequestBytes = (body: unknown) => {
  if (!body || typeof body !== 'object') return 0;
  try {
    return Buffer.byteLength(JSON.stringify(body), 'utf8');
  } catch {
    return 0;
  }
};

export const aiCallLogMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startedAt = Date.now();

  res.on('finish', () => {
    recordAiCall({
      aiKeyId: req.aiKey?.id || null,
      agentName: req.aiKey?.name || null,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      latencyMs: Date.now() - startedAt,
      requestBytes: getRequestBytes(req.body),
      ip: req.ip,
      userAgent: req.headers['user-agent']?.toString(),
      traceId: req.traceId,
    }).catch((error) => {
      console.error('[ai-call-log]', error);
    });
  });

  next();
};
