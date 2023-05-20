import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateMonitorDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, example: "http://localhost:8000" })
  public readonly endpoint?: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ type: Number })
  public readonly count?: number;

  @IsBoolean()
  @ApiHideProperty()
  public readonly isDeleted?: boolean = false;
}