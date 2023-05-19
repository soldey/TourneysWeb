import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @ApiProperty({ type: String, example: 'Team Spirit' })
  public readonly name: string;
}