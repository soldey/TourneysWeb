import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApplyToTournamentDto {
  @IsUUID()
  @ApiProperty({ type: String })
  public readonly id: string;

  @IsString()
  @ApiProperty({ type: String, example: "team", default: "team" })
  public readonly type: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  public readonly target?: string;
}