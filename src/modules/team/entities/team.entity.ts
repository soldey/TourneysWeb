import {
  BaseEntity,
  Column, CreateDateColumn,
  Entity, Index,
  JoinColumn,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { TeamRelationEntity } from './team-relation.entity';

@Entity('team')
export class TeamEntity extends BaseEntity {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @ApiProperty({ maxLength: 80, example: 'Team Spirit' })
  @Column({ type: 'varchar', length: 80 })
  public readonly name: string;

  @ApiProperty({ type: () => UserEntity })
  @JoinColumn()
  @ManyToOne(() => UserEntity, { nullable: false })
  public captain: UserEntity;

  @ApiProperty({ type: () => [UserEntity] })
  @JoinColumn()
  @OneToMany(() => TeamRelationEntity, (teamRelation) => teamRelation.team)
  public readonly members?: TeamRelationEntity[];

  @ApiProperty({ readOnly: true })
  @Index()
  @CreateDateColumn({
    readonly: true,
    type: 'timestamptz',
    default: () => 'NOW()'
    })
  public readonly createdAt: Date;

  @ApiProperty({ readOnly: true })
  @UpdateDateColumn({
    readonly: true,
    type: 'timestamptz',
    default: () => 'NOW()'
  })
  public readonly updatedAt: Date;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'boolean', default: false })
  public readonly isDeleted: boolean;
}