import { Module } from '@nestjs/common';
import { ConfigModule } from './config';
import { IndexModule } from './modules/index/index.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database';
import { AuthModule } from './modules/auth';
import { TournamentModule } from './modules/tournament';

@Module({
  imports: [
    CommonModule,
    ConfigModule,
    IndexModule,
    DatabaseModule,
    AuthModule,
    TournamentModule,
  ],
})
export class AppModule {}
