import { forwardRef, Module } from '@nestjs/common';
import { IndexController } from './index.controller';
import { AuthModule } from '../auth/auth.module';
import { MonitorModule } from '../monitor/monitor.module';

@Module({
  imports: [AuthModule, forwardRef(() => MonitorModule)],
  controllers: [IndexController],
  providers: [],
  exports: []
})
export class IndexModule {}
