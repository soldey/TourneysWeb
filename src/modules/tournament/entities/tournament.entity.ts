import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn, ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TournamentParticipantEntity } from './tournament-participant.entity';
import { User } from '../../../common/decorators';
import { UserEntity } from '../../user/entities/user.entity';

export enum TournamentTypeEnum {
  SOLO = 'SOLO',
  TEAM = 'TEAM',
}

export enum TournamentStatusEnum {
  CREATED = 'CREATED',
  ONGOING = 'ONGOING',
  FINISHED = 'FINISHED',
}

@Entity('tournament')
export class TournamentEntity extends BaseEntity {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @ApiProperty({ maxLength: 100, example: 'The International' })
  @Column({ type: 'varchar', length: 100 })
  public readonly name: string;

  @ApiProperty({ enum: TournamentTypeEnum, default: TournamentTypeEnum.SOLO })
  @Column({ type: 'enum', enum: TournamentTypeEnum, default: TournamentTypeEnum.SOLO })
  public readonly type: TournamentTypeEnum;

  @ApiProperty({ type: () => [TournamentParticipantEntity] })
  @JoinColumn()
  @OneToMany(() => TournamentParticipantEntity, (tournamentParticipant) => tournamentParticipant.tournament)
  public readonly participants?: TournamentParticipantEntity;

  @ApiProperty({ type: () => UserEntity })
  @JoinColumn()
  @ManyToOne(() => UserEntity, { nullable: false })
  public host: UserEntity;

  @ApiProperty({ type: TournamentStatusEnum, default: TournamentStatusEnum.CREATED })
  @Column({ type: 'enum', enum: TournamentStatusEnum, default: TournamentStatusEnum.CREATED })
  public readonly status: TournamentStatusEnum;

  @ApiProperty({ example: '2023-05-20' })
  @Column({ type: 'date' })
  public readonly startDate: string;

  @ApiProperty({ example: '11:30'})
  @Column({ type: 'time' })
  public readonly startTime: string;

  @ApiProperty({ readOnly: true })
  @Index()
  @CreateDateColumn({
    readonly: true,
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  public readonly createdAt: Date;

  @ApiProperty({ readOnly: true })
  @UpdateDateColumn({
    readonly: true,
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  public readonly updatedAt: Date;

  @ApiProperty({ readOnly: true })
  @Column({ type: 'boolean', default: false })
  public readonly isDeleted: boolean;
}