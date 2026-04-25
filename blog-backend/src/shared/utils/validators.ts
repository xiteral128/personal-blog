import { AppError } from '../errors/appError';

export const requireString = (value: unknown, field: string) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new AppError(400, `${field}不能为空`);
  }
  return value.trim();
};

export const requireNumber = (value: unknown, field: string) => {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    throw new AppError(400, `${field}格式不正确`);
  }
  return num;
};

export const parsePagination = (page: unknown, limit: unknown, defaultLimit = 10) => {
  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = Math.max(1, Math.min(100, Number(limit) || defaultLimit));
  return {
    page: currentPage,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  };
};
