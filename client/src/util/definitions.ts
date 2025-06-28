export interface User {
  id: string;
  username: string;
  email: string;
  accountType: 'free' | 'pro';
  JWTToken: string;
}
