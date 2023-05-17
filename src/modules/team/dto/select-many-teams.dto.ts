import { FindManyOptionsDto } from '../../../common/dto/find-many-options.dto';
import { TeamEntity } from '../entities/team.entity';

export class SelectManyTeamsDto extends FindManyOptionsDto<TeamEntity> {}