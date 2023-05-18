import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentEntity } from './entities/tournament.entity';
import { TournamentParticipantEntity } from './entities/tournament-participant.entity';
import { TeamModule } from '../team';
import { UserModule } from '../user';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TournamentEntity, TournamentParticipantEntity]),
    forwardRef(() => TeamModule),
    forwardRef(() => UserModule),
  ],
  controllers: [TournamentController],
  providers: [TournamentService],
  exports: [TournamentService],
})
export class TournamentModule {}