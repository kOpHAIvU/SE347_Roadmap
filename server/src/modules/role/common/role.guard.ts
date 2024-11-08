import { UserService } from './../../user/user.service';
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
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return true;  // Nếu không có vai trò yêu cầu, cho phép truy cập
    }
    Logger.log("Require role", requiredRoles);
    
    const { user } =  context.switchToHttp().getRequest();

    console.log("User", user);

    let roleString;
    //console.log(`User roles endpoint: ${requiredRoles}`);
    const userLoginResponse = await this.userService.findOneById(user.userId);
    const userLogin = Array.isArray(userLoginResponse.data)
                    ? userLoginResponse.data[0]
                    : userLoginResponse.data;            

    if (userLoginResponse.statusCode == 404) {
      throw new Error("User not found");
    } else {
      roleString = userLogin.role.name; 

    } 
   const allow = requiredRoles.some(
    (role) => role.trim().toLowerCase() == roleString.trim().toLowerCase()
  );
    Logger.log(`Allow user to login the system: ${allow}`);
    return allow;
  }
}

