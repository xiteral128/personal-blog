export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: number;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown, code?: number) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code ?? statusCode;
    this.details = details;
  }
}
