import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TeamEntity } from './team.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('team-relation')
export class TeamRelationEntity extends BaseEntity {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @ApiProperty({ type: () => TeamEntity })
  @ManyToOne(() => TeamEntity)
  @JoinColumn()
  public readonly team: TeamEntity;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity)
  @JoinColumn()
  public readonly user: UserEntity;
}