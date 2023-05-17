import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { UserEntity } from '../../user/entities/user.entity';
import { RolesEnum } from '../../../common/enums/roles.enum';
import { ErrorTypeEnum } from '../../../common/enums/error-type.enum';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  public handleRequest(
    err: Error,
    user: UserEntity,
    info: Error,
    ctx: ExecutionContext,
  ): UserEntity | any {
    const roles = this.reflector.get<string[]>('roles', ctx.getHandler());
    if (!roles || (roles && roles.includes(user.role))) return user;
    if (user.role == RolesEnum.ADMIN) return user;

    throw new ForbiddenException(ErrorTypeEnum.AUTH_FORBIDDEN);
  }
}
