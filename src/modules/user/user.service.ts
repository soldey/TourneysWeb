import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { FindOneOptions, FindOptionsWhere, Repository, SaveOptions } from 'typeorm';
import { ErrorTypeEnum } from '../../common/enums/error-type.enum';
import { PaginationUsersDto } from './dto/pagination-users.dto';
import { SelectManyUsersDto } from './dto/select-many-users.dto';
import { StatusEnum } from '../../common/enums/status.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    public readonly userEntityRepository: Repository<UserEntity>,
  ) {}

  public async createOne(
    entityLike: Partial<UserEntity>,
    options: SaveOptions = { transaction: false },
  ): Promise<UserEntity> {
    return this.userEntityRepository.manager.transaction(async () => {
      const entity = this.userEntityRepository.create({ ...entityLike, status: StatusEnum.ACTIVATED });
      return this.userEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.USER_ALREADY_EXISTS)
      });
    });
  }

  public async selectOne(
    conditions: Partial<UserEntity>,
  ): Promise<UserEntity> {
    return this.userEntityRepository
      .findOneOrFail({
        where: conditions as unknown as FindOptionsWhere<UserEntity>,
        relations: ['teams']
      })
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.USER_NOT_FOUND);
      });
  }

  public async selectMany(
    options: SelectManyUsersDto
  ): Promise<PaginationUsersDto> {
    return this.userEntityRepository
      .createQueryBuilder('user')
      .skip(options.skip)
      .take(options.take)
      .getManyAndCount()
      .then((data) => new PaginationUsersDto(data))
      .catch()
  }

  public async updateOne(
    conditions: Partial<UserEntity>,
    entityLike: Partial<UserEntity>,
    options: SaveOptions = { transaction: false }
  ): Promise<UserEntity> {
    return this.userEntityRepository.manager.transaction(async () => {
      const mergeIntoEntity = await this.selectOne(conditions);
      const entity = this.userEntityRepository.merge(mergeIntoEntity, entityLike);
      return this.userEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.USER_ALREADY_EXISTS)
      })
    });
  }

  public async deleteOne(
    conditions: Partial<UserEntity>,
  ): Promise<UserEntity> {
    return this.updateOne(conditions, { isDeleted: true });
  }
}