import { Role } from 'common/constants/roles';
import { Request } from 'express';

export interface LoginPayload {
  role?: Role;
  username: string;
  sub: string;
}

export interface JwtUserPayload {
  role?: Role;
  username: string;
  id: string;
}

export interface RequestWithUser extends Request {
  user: JwtUserPayload;
}
