import 'express';

declare global {
  namespace Express {
    interface Request {
      visitorId?: string;
      user?: {
        id: string;
      };
    }
  }
}
