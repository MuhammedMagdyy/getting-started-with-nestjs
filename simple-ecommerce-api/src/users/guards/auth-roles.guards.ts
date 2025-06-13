import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CURRENT_USER_KEY, ROLES_KEY } from 'src/common/utils/constants';
import { JwtPayload } from 'src/common/utils/types';
import { UserType } from '../enums/user-type.enum';
import { UsersService } from '../users.service';

@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles: UserType[] = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || !roles.length) {
      return false;
    }

    const request: Request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Access denied. No token provided');
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const user = await this.userService.getCurrentUser(payload.id);

      if (!user || !roles.includes(user.userType)) {
        return false;
      }

      request[CURRENT_USER_KEY] = payload;
    } catch {
      throw new ForbiddenException('Access denied. Invalid token.');
    }

    return true;
  }
}
