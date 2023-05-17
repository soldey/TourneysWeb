import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { TeamEntity } from '../entities/team.entity';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTeamDto {
  @IsUUID()
  @ApiProperty({ type: String })
  public readonly captain: string;

  @IsString()
  @ApiProperty({ type: String, example: 'Team Spirit' })
  public readonly name: string;
}