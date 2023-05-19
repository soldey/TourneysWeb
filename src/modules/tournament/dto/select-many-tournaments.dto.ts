import { FindManyOptionsDto } from '../../../common/dto/find-many-options.dto';
import { TournamentEntity } from '../entities/tournament.entity';

export class SelectManyTournamentsDto extends FindManyOptionsDto<TournamentEntity> {}