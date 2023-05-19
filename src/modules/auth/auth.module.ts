import { Module } from '@nestjs/common';
import { ConfigService } from '../../config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        defaultStrategy: configService.get('PASSPORT_STRATEGY'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('PASSPORT_SECRET'),
          signOptions: {
            expiresIn: configService.get('PASSPORT_EXPIRES'),
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
