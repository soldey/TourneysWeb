import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from './entities/team.entity';
import { TeamRelationEntity } from './entities/team-relation.entity';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { UserModule } from '../user';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamEntity, TeamRelationEntity]),
    forwardRef(() => UserModule),
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}