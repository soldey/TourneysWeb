import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('monitor')
export class MonitorEntity extends BaseEntity {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @ApiProperty({ type: String, example: 'https://localhost:8000/api/v1', uniqueItems: true })
  @Column({ type: 'varchar', length: 80, unique: true })
  public readonly endpoint: string;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  public readonly count: number;

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
