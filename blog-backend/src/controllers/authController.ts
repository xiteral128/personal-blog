import { Request, Response } from 'express';
import { loginAdmin, logoutAdminSession, refreshAdminSession, getCurrentSessionUser } from '../modules/auth/service';
import { asyncHandler } from '../shared/utils/asyncHandler';
import { sendNoContent, sendSuccess } from '../shared/utils/response';
import { requireString } from '../shared/utils/validators';
import { env } from '../config/env';
import { getRequestAccessToken } from '../shared/middleware/auth';

const applyRefreshCookie = (res: Response, refreshToken: string) => {
  res.cookie(env.refreshCookieName, refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.nodeEnv === 'production',
    path: '/api/v1/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearRefreshCookie = (res: Response) => {
  res.clearCookie(env.refreshCookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.nodeEnv === 'production',
    path: '/api/v1/auth',
  });
};

export const login = asyncHandler(async (req: Request, res: Response) => {
  const username = requireString(req.body.username, '用户名');
  const password = requireString(req.body.password, '密码');

  const result = await loginAdmin(username, password);
  applyRefreshCookie(res, result.refreshToken);

  return sendSuccess(res, {
    accessToken: result.accessToken,
    sessionId: result.sessionId,
    user: result.user,
  }, '登录成功');
});

export const refreshSession = asyncHandler(async (req: Request, res: Response) => {
  const sessionId = requireString(req.body.sessionId, 'sessionId');
  const refreshToken = req.cookies?.[env.refreshCookieName];
  const result = await refreshAdminSession(sessionId, refreshToken);
  applyRefreshCookie(res, result.refreshToken);

  return sendSuccess(res, {
    accessToken: result.accessToken,
    sessionId: result.sessionId,
    user: result.user,
  }, '刷新成功');
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const token = getRequestAccessToken(req);
  const user = await getCurrentSessionUser(token);
  return sendSuccess(res, user, '获取成功');
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const sessionId = req.body.sessionId as string | undefined;
  if (sessionId) {
    await logoutAdminSession(sessionId, req.user?.id);
  }
  clearRefreshCookie(res);
  return sendNoContent(res, '退出成功');
});
