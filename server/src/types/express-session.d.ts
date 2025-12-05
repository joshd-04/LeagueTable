import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: {
      _id: string;
      username: string;
      email: string;
    };
    createdAt: number;
    lastActivity: number;
    absoluteSessionAgeLimit: number;
  }
}
