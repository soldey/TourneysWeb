import { IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';

export class SelectOneTeamDto {

  @IsOptional()
  @ApiPropertyOptional({ type: String, example: 'Team Spirit' })
  public readonly name?: string;
}