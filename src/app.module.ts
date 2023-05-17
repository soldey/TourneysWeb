import { Module } from '@nestjs/common';
import { ConfigModule } from './config';
import { IndexModule } from './modules/index/index.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database';
import { UserModule } from './modules/user';
import { AuthModule } from './modules/auth';
import { TeamModule } from './modules/team';

@Module({
  imports: [
    CommonModule,
    ConfigModule,
    IndexModule,
    DatabaseModule,
    AuthModule,
    TeamModule,
  ],
})
export class AppModule {}
