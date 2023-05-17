import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../../config';
import { AuthService } from '../auth.service';
import { JwtValidateResponseDto } from '../dto/jwt-validate-response.dto';
import { UserEntity } from '../../user/entities/user.entity';
import { ValidateUserDto } from '../dto/validate-user.dto';
import { StatusEnum } from '../../../common/enums/status.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('PASSPORT_SECRET'),
      ignoreExpiration: true,
    });
  }

  public async validate({ id, ppid, role }: JwtValidateResponseDto): Promise<UserEntity> {
    return this.authService.validateUser({ id: id, ppid: ppid, status: StatusEnum.ACTIVATED });
  }
}