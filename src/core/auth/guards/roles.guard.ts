import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'common/constants/roles';
import { ROLES_KEY } from 'common/decorators/roles';
import { Request as ExpressRequest } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!allowedRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<ExpressRequest>();
    if (!request.user) {
      return false;
    }
    const { id } = request.user;
    const role = await this.authService.getRole(id);
    request.user = { ...request.user, role: role };

    return allowedRoles.some(
      (allowedRole) => request.user.role === allowedRole,
    );
  }
}
