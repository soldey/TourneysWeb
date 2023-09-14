import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SelectOneMonitorDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  public readonly id?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, example: 'http://localhost:8000' })
  public readonly endpoint?: string;
}