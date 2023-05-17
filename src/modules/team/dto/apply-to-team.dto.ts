import { PickType } from '@nestjs/swagger';
import { TeamEntity } from '../entities/team.entity';

export class ApplyToTeamDto extends PickType(TeamEntity, ['name']) {}