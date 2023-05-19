import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TournamentTypeEnum } from '../entities/tournament.entity';

export class CreateTournamentDto {
  @IsString()
  @ApiProperty({ type: String, example: 'The International' })
  public readonly name: string;

  @IsString()
  @ApiProperty({ example: '2023-05-20' })
  public readonly startDate: string;

  @IsString()
  @ApiProperty({ example: '09:30' })
  public readonly startTime: string;

  @IsEnum(TournamentTypeEnum)
  @ApiProperty({ enum: TournamentTypeEnum, default: TournamentTypeEnum.SOLO })
  public readonly type: TournamentTypeEnum;
}