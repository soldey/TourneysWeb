import { ApiHideProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { TeamEntity } from '../entities/team.entity';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { UserEntity } from '../../user/entities/user.entity';

export class UpdateTeamDto {
  @IsOptional()
  @ApiPropertyOptional({ type: String, example: 'Team Spirit' })
  public readonly name?: string;

  @IsOptional()
  @ApiPropertyOptional({ example: '2c352d71-3cd2-4202-8ba7-531147c49ed5' })
  public readonly captain?: string;

  @IsBoolean()
  @ApiHideProperty()
  public readonly isDeleted: boolean = false;
}