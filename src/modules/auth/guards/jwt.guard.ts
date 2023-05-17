import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { UserEntity } from '../../user/entities/user.entity';
import { ErrorTypeEnum } from '../../../common/enums/error-type.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  public handleRequest(
    err: Error,
    user: UserEntity,
    info: Error,
    ctx: ExecutionContext,
  ): UserEntity | any {
    if (info) throw new UnauthorizedException(ErrorTypeEnum.AUTH_INVALID_TOKEN);
    if (!user) throw new UnauthorizedException(ErrorTypeEnum.AUTH_UNATHORIZED);
    return user;
  }
}