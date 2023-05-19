import { IsBoolean, IsOptional } from 'class-validator';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTournamentDto {
  @IsOptional()
  @ApiPropertyOptional({ type: String, example: 'Team Spirit' })
  public readonly name?: string;

  @IsBoolean()
  @ApiHideProperty()
  public readonly isDeleted: boolean = false;
}