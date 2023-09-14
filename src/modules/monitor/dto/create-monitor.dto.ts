import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateMonitorDto {
  @IsString()
  @ApiProperty({ type: String, example: "http://localhost:8000" })
  public readonly endpoint: string;
}