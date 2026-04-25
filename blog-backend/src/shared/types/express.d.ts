declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      username: string;
    };
    aiKey?: {
      id: number;
      name: string;
      mode: 'autonomous' | 'review';
      dailyLimit: number;
    };
    traceId?: string;
  }
}
