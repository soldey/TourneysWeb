import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { TeamEntity } from '../entities/team.entity';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @ApiProperty({ type: String, example: 'Team Spirit' })
  public readonly name: string;
}