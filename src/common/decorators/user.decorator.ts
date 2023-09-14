import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../modules/user/entities/user.entity';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user && request.user[data] : request.user;
  },
);
