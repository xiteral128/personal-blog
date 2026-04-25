import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env';

export interface AuthPayload {
  id: number;
  username: string;
  sessionId?: string;
}

export const signAccessToken = (payload: AuthPayload) => {
  const secret: Secret = env.jwtSecret;
  const options: SignOptions = { expiresIn: env.accessTokenExpiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, secret, options);
};

export const verifyAccessToken = (token: string): AuthPayload => {
  return jwt.verify(token, env.jwtSecret) as AuthPayload;
};
