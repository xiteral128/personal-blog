import bcrypt from 'bcryptjs';
import { AppError } from '../../shared/errors/appError';
import { signAccessToken, verifyAccessToken } from '../../shared/auth/jwt';
import {
  createRefreshSession,
  getRefreshSession,
  replaceRefreshSession,
  revokeRefreshSession,
} from '../../shared/auth/tokenStore';
import { findUserByUsername } from './repository';

export const loginAdmin = async (username: string, password: string) => {
  const user = await findUserByUsername(username);

  if (!user) {
    throw new AppError(401, '用户名或密码错误');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new AppError(401, '用户名或密码错误');
  }

  const refreshSession = await createRefreshSession(user.id, user.username);
  const accessToken = signAccessToken({
    id: user.id,
    username: user.username,
    sessionId: refreshSession.sessionId,
  });

  return {
    accessToken,
    refreshToken: refreshSession.refreshToken,
    sessionId: refreshSession.sessionId,
    user: {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
    },
  };
};

export const refreshAdminSession = async (sessionId: string, refreshToken: string) => {
  const session = await getRefreshSession(sessionId);
  if (!session || session.refreshToken !== refreshToken) {
    throw new AppError(401, '登录态已失效，请重新登录');
  }

  const nextSession = await replaceRefreshSession(sessionId, session.userId, session.username);
  const accessToken = signAccessToken({
    id: session.userId,
    username: session.username,
    sessionId: nextSession.sessionId,
  });

  return {
    accessToken,
    refreshToken: nextSession.refreshToken,
    sessionId: nextSession.sessionId,
    user: {
      id: session.userId,
      username: session.username,
    },
  };
};

export const logoutAdminSession = async (sessionId: string, userId?: number) => {
  await revokeRefreshSession(sessionId, userId);
};

export const getCurrentSessionUser = async (token: string) => {
  try {
    const payload = verifyAccessToken(token);
    if (!payload.sessionId) {
      throw new AppError(401, '登录态已失效，请重新登录');
    }

    const session = await getRefreshSession(payload.sessionId);
    if (!session) {
      throw new AppError(401, '登录态已失效，请重新登录');
    }

    return {
      id: payload.id,
      username: payload.username,
      sessionId: payload.sessionId,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(401, '登录态已失效，请重新登录');
  }
};
