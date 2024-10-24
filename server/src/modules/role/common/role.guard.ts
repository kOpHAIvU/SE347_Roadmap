// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role.decorator';
import { RoleService } from '../role.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;  // Nếu không có vai trò yêu cầu, cho phép truy cập
    }
    
    const { user } =  context.switchToHttp().getRequest();
    console.log("User", user.userRole);

    //console.log(`User roles endpoint: ${requiredRoles}`);
    const rolesObject = await this.roleService.findOne(user.userRole);
    const roleString = rolesObject.data.name;
   // console.log(`User roles: ${roleString}`);
    return requiredRoles.some((role) => roleString?.includes(role));
  }
}

