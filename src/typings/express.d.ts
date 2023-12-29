export {};
export interface User {
  id: string;
  username: string;
  role?: number;
}
// Typing the User object that will get injected by Passport-jwt into req.user
declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}
