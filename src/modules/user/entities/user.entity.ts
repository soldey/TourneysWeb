import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { RolesEnum } from '../../../common/enums/roles.enum';

import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { StatusEnum } from '../../../common/enums/status.enum';
import { TeamEntity } from '../../team/entities/team.entity';
import { TeamRelationEntity } from '../../team';

@Entity('user')
export class UserEntity extends BaseEntity {
  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  /**
   * [description]
   */
  @Exclude()
  @ApiHideProperty()
  @Index()
  @Column({ type: 'varchar', length: 64 })
  public ppid: string;

  /**
   * [description]
   */
  @ApiProperty({ enum: StatusEnum, default: StatusEnum.DEACTIVATED })
  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.DEACTIVATED })
  public readonly status: StatusEnum;

  /**
   * [description]
   */
  @ApiProperty({ enum: RolesEnum, default: RolesEnum.USER })
  @Column({ type: 'enum', enum: RolesEnum, default: RolesEnum.USER })
  public readonly role: RolesEnum;

  /**
   * [description]
   */
  @ApiProperty({ maxLength: 50 })
  @Column({ type: 'varchar', length: 50 })
  public readonly firstName: string;

  /**
   * [description]
   */
  @ApiProperty({ maxLength: 50 })
  @Column({ type: 'varchar', length: 50 })
  public readonly lastName: string;

  @ApiProperty({ type: () => [String] })
  @OneToMany(() => TeamRelationEntity, (teamRelation) => teamRelation.user)
  @JoinColumn()
  public readonly teams?: TeamRelationEntity[];

  /**
   * [description]
   */
  @ApiProperty({ maxLength: 320, uniqueItems: true })
  @Column({ type: 'varchar', length: 320, unique: true })
  public readonly email: string;

  /**
   * [description]
   */
  @Exclude()
  @ApiHideProperty()
  @Column({ type: 'varchar', length: 64 })
  public password?: string;

  /**
   * [description]
   */
  @Exclude()
  @ApiHideProperty()
  public _password: string;

  /**
   * [description]
   * @private
   */
  @AfterLoad()
  private loadTempPassword(): void {
    this._password = this.password;
  }

  /**
   * [description]
   */
  @BeforeInsert()
  @BeforeUpdate()
  public async hashPassword(): Promise<void> {
    if (this.password && this.password !== this._password) {
      this.password = await bcrypt.hash(this.password, 8);
    }

    this.ppid = crypto
      .createHash('sha256')
      .update(this.password)
      .update(this.status)
      .update(this.role)
      .digest('base64');
  }

  /**
   * [description]
   * @param password
   */
  public async comparePassword(password: UserEntity['password']): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return bcrypt.compare(password, this.password, (err, same) => {
        if (err) reject(err);
        return same ? resolve(same) : reject(same);
      });
    });
  }

  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @CreateDateColumn({
    readonly: true,
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  public readonly createdAt: Date;

  /**
   * [description]
   */
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