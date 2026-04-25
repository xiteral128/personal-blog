import dotenv from 'dotenv';

dotenv.config();

const parseOrigins = () => {
  if (!process.env.CORS_ORIGIN) return ['*'];
  return process.env.CORS_ORIGIN.split(',').map((item) => item.trim()).filter(Boolean);
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  dbHost: process.env.DB_HOST || 'localhost',
  dbUser: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || 'my_blog',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  corsOrigin: parseOrigins(),
  redisUrl: process.env.REDIS_URL || 'redis://redis:6379',
  redisPrefix: process.env.REDIS_PREFIX || 'blog',
  refreshCookieName: process.env.REFRESH_COOKIE_NAME || 'blog_refresh_token',
  qdrantUrl: process.env.QDRANT_URL || 'http://qdrant:6333',
  qdrantCollection: process.env.QDRANT_COLLECTION || 'blog_articles',
  llmProvider: process.env.LLM_PROVIDER || 'pseudo',
  llmApiKey: process.env.LLM_API_KEY || '',
  llmBaseUrl: process.env.LLM_BASE_URL || '',
  llmModel: process.env.LLM_MODEL || 'pseudo-rag',
};
