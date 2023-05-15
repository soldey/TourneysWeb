import { Module } from '@nestjs/common';
import { IndexController } from './index.controller';

@Module({
  imports: [],
  controllers: [IndexController],
  providers: [],
  exports: []
})
export class IndexModule {}
