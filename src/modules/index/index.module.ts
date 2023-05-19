import { Module } from '@nestjs/common';
import { IndexController } from './index.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [IndexController],
  providers: [],
  exports: []
})
export class IndexModule {}
