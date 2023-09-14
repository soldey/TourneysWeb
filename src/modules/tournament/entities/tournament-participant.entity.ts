import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';
import { TeamEntity } from '../../team/entities/team.entity';
import { TournamentEntity } from './tournament.entity';

@Entity('tournament-participant')
export class TournamentParticipantEntity extends BaseEntity {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @ApiProperty({ type: () => TeamEntity })
  @ManyToOne(() => TeamEntity)
  @JoinColumn()
  public readonly team?: TeamEntity;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity)
  @JoinColumn()
  public readonly user?: UserEntity;

  @ApiProperty({ type: () => TournamentEntity })
  @ManyToOne(() => TournamentEntity)
  @JoinColumn()
  public readonly tournament?: TournamentEntity;
}