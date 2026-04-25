import crypto from 'crypto';
import { ensureRedis, buildCacheKey } from '../cache/redis';
import { env } from '../../config/env';

const refreshTokenKey = (sessionId: string) => buildCacheKey('refresh', sessionId);
const userSessionSetKey = (userId: number) => buildCacheKey('user-sessions', userId);

const parseDurationToSeconds = (value: string) => {
  const matched = value.match(/^(\d+)([smhd])$/i);
  if (!matched) return 7 * 24 * 60 * 60;
  const amount = Number(matched[1]);
  const unit = matched[2].toLowerCase();
  const map: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
  return amount * map[unit];
};

const refreshTtl = parseDurationToSeconds(env.refreshTokenExpiresIn);

export interface RefreshSessionPayload {
  sessionId: string;
  refreshToken: string;
  userId: number;
  username: string;
}

export const createRefreshSession = async (userId: number, username: string) => {
  const client = await ensureRedis();
  const sessionId = crypto.randomUUID();
  const refreshToken = crypto.randomBytes(48).toString('hex');
  const payload: RefreshSessionPayload = { sessionId, refreshToken, userId, username };

  await client.set(refreshTokenKey(sessionId), JSON.stringify(payload), { EX: refreshTtl });
  await client.sAdd(userSessionSetKey(userId), sessionId);
  await client.expire(userSessionSetKey(userId), refreshTtl);

  return payload;
};

export const getRefreshSession = async (sessionId: string) => {
  const client = await ensureRedis();
  const value = await client.get(refreshTokenKey(sessionId));
  return value ? (JSON.parse(value) as RefreshSessionPayload) : null;
};

export const replaceRefreshSession = async (oldSessionId: string, userId: number, username: string) => {
  await revokeRefreshSession(oldSessionId, userId);
  return createRefreshSession(userId, username);
};

export const revokeRefreshSession = async (sessionId: string, userId?: number) => {
  const client = await ensureRedis();
  await client.del(refreshTokenKey(sessionId));
  if (userId) {
    await client.sRem(userSessionSetKey(userId), sessionId);
  }
};

export const revokeAllUserSessions = async (userId: number) => {
  const client = await ensureRedis();
  const setKey = userSessionSetKey(userId);
  const sessionIds = await client.sMembers(setKey);
  if (sessionIds.length) {
    const keys = sessionIds.map((id) => refreshTokenKey(id));
    await client.del(keys);
  }
  await client.del(setKey);
};
