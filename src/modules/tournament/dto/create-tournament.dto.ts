import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTournamentDto {
  @IsString()
  @ApiProperty({ type: String, example: 'The International' })
  public readonly name: string;
}