import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { IndexModule } from './modules/index/index.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { TournamentModule } from './modules/tournament/tournament.module';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundExceptionFilter } from './common/not-found-exception.filter';

@Module({
  imports: [
    CommonModule,
    ConfigModule,
    IndexModule,
    DatabaseModule,
    AuthModule,
    TournamentModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
  ],
})
export class AppModule {}
