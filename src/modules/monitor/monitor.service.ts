import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorEntity } from './entities/monitor.entity';
import { FindOptionsWhere, Repository, SaveOptions } from 'typeorm';
import { ErrorTypeEnum } from '../../common/enums/error-type.enum';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { SelectManyMonitorsDto } from './dto/select-many-monitors.dto';
import { PaginationMonitorsDto } from './dto/pagination-monitors.dto';

@Injectable()
export class MonitorService {
  constructor(
    @InjectRepository(MonitorEntity)
    public readonly monitorEntityRepository: Repository<MonitorEntity>,
  ) {}

  public async createOne(
    entityLike: Partial<MonitorEntity>,
    options: SaveOptions = { transaction: false }
  ): Promise<MonitorEntity> {
    return this.monitorEntityRepository.manager.transaction(async () => {
      const existingMonitor = await this.selectOne({ endpoint: entityLike.endpoint }).catch(() => {
        // skip
      });
      if (existingMonitor) throw new ConflictException(ErrorTypeEnum.STAT_ALREADY_EXISTS);

      const entity = this.monitorEntityRepository.create(entityLike);
      return this.monitorEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.STAT_ALREADY_EXISTS);
      });
    })
  }

  public async selectOne(
    conditions: Partial<MonitorEntity>,
    eager = false,
  ): Promise<MonitorEntity> {
    return this.monitorEntityRepository
      .findOneOrFail({
        where: { ...conditions, isDeleted: false } as unknown as FindOptionsWhere<MonitorEntity>,
        loadEagerRelations: eager,
      }).catch(() => {
        throw new NotFoundException(ErrorTypeEnum)
      });
  }

  public async selectAll(
    options: SelectManyMonitorsDto,
  ): Promise<PaginationMonitorsDto> {
    return this.monitorEntityRepository
      .createQueryBuilder('monitor')
      .where('monitor.isDeleted = :isDeleted', { isDeleted: false })
      .skip(options.skip)
      .take(options.take)
      .orderBy('monitor.count', 'DESC')
      .getManyAndCount()
      .then((data) => new PaginationMonitorsDto(data))
      .catch();
  }

  public async updateOne(
    conditions: Partial<MonitorEntity>,
    entityLike: UpdateMonitorDto,
    options: SaveOptions = { transaction: false },
  ): Promise<MonitorEntity> {
    return this.monitorEntityRepository.manager.transaction(async () => {
      const mergeIntoEntity = await this.selectOne(conditions);

      const entity = this.monitorEntityRepository.merge(mergeIntoEntity, { ...entityLike });
      return this.monitorEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.STAT_ALREADY_EXISTS);
      });
    });
  }

  public async deleteOne(
    conditions: Partial<MonitorEntity>
  ): Promise<MonitorEntity> {
    return this.updateOne(conditions, { isDeleted: true });
  }

  public async createOrIncrement(
    conditions: Partial<MonitorEntity>,
  ): Promise<MonitorEntity> {
    let entity = await this.selectOne(conditions).catch(() => {
      // skip
    });
    if (!entity) entity = await this.createOne({ endpoint: conditions.endpoint });
    return this.updateOne({ endpoint: conditions.endpoint }, { count: entity.count + 1 });
  }
}