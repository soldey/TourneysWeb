import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ApplyToTeamDto {
  @IsString()
  @ApiProperty({ type: String, example: "Team Spirit" })
  public readonly name: string;
}
