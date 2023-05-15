import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config';
import { IndexModule } from './modules/index/index.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule,
    IndexModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
