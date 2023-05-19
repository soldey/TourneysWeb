import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamEntity } from './entities/team.entity';
import { FindOptionsWhere, RemoveOptions, Repository, SaveOptions } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { ErrorTypeEnum } from '../../common/enums/error-type.enum';
import { SelectManyTeamsDto } from './dto/select-many-teams.dto';
import { PaginationTeamsDto } from './dto/pagination-teams.dto';
import { UserEntity } from '../user/entities/user.entity';
import { RolesEnum } from '../../common/enums/roles.enum';
import { TeamRelationEntity } from './entities/team-relation.entity';
import { UserService } from '../user/user.service';
import { UpdateTeamDto } from './dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity)
    public readonly teamEntityRepository: Repository<TeamEntity>,
    @InjectRepository(TeamRelationEntity)
    public readonly teamRelationEntityRepository: Repository<TeamRelationEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  public async createOne(
    entityLike: CreateTeamDto,
    captain: UserEntity,
    options: SaveOptions = { transaction: false },
  ): Promise<TeamEntity> {
    const team = await this.teamEntityRepository.manager.transaction(async () => {
      const existingTeam = await this.selectOne({ name: entityLike.name }).catch(() => {
        // skip
      });
      if (existingTeam) throw new ConflictException(ErrorTypeEnum.TEAM_ALREADY_EXISTS);

      const entity = this.teamEntityRepository.create({
          name: entityLike.name,
          captain: captain,
        });
      const teamEntity = await this.teamEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.TEAM_ALREADY_EXISTS);
      });
      return teamEntity;
    });
    await this.createOneRelation(team, captain);
    return team;
  }

  public async createOneRelation(
    conditions: Partial<TeamEntity>,
    user: UserEntity,
    options: SaveOptions = { transaction: false },
  ): Promise<TeamRelationEntity> {
    return this.teamRelationEntityRepository.manager.transaction(async () => {
      const existingRelation = await this.selectOneRelationByBoth(conditions, { id: user.id }).catch(() => {
        // skip
      });
      if (existingRelation) throw new ConflictException(ErrorTypeEnum.PLAYER_ALREADY_IN_THIS_TEAM);

      const entity = this.teamRelationEntityRepository.create(
        {
          team: await this.selectOne({ id: conditions.id }),
          user: user,
        }
      );
      return this.teamRelationEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.PLAYER_ALREADY_IN_THIS_TEAM);
      })
    })
  }

  public async selectOneRelation(
    conditions: Partial<TeamRelationEntity>
  ): Promise<TeamRelationEntity> {
    return this.teamRelationEntityRepository
      .createQueryBuilder('relation')
      .leftJoin('relation.team', 'team')
      .leftJoin('relation.user', 'user')
      .where('relation.id = :relationId', { relationId: conditions.id })
      .select(['relation.id', 'team.id', 'user.id'])
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.RELATION_NOT_FOUND);
      });
  }

  public async selectOneRelationByBoth(
    conditions: Partial<TeamEntity>,
    user: Partial<UserEntity>
  ): Promise<TeamRelationEntity> {
    return this.teamRelationEntityRepository
      .createQueryBuilder('teamRelation')
      .leftJoin('teamRelation.team', 'team')
      .leftJoin('teamRelation.user', 'user')
      .where('team.id = :teamId', { teamId: conditions.id })
      .andWhere('user.id = :userId', { userId: user.id })
      .select(['teamRelation.id', 'team.id', 'user.id'])
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.PLAYER_NOT_IN_A_TEAM);
      })
  }

  public async selectOne(
    conditions: Partial<TeamEntity>
  ): Promise<TeamEntity> {
    return this.teamEntityRepository
      .findOneOrFail({
        where: conditions as unknown as FindOptionsWhere<TeamEntity>,
        relations: [
          'members',
          'captain'
        ],
        loadEagerRelations: true,
      }).catch(() => {
        throw new NotFoundException(ErrorTypeEnum.TEAM_NOT_FOUND);
      });
  }

  public async selectAll(
    options: SelectManyTeamsDto,
  ): Promise<PaginationTeamsDto> {
    return this.teamEntityRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.captain', 'captain')
      .leftJoinAndSelect('team.members', 'members')
      .skip(options.skip)
      .take(options.take)
      .getManyAndCount()
      .then((data) => new PaginationTeamsDto(data))
      .catch();
  }

  public async updateOne(
    conditions: Partial<TeamEntity>,
    entityLike: UpdateTeamDto,
    options: SaveOptions = { transaction: false },
  ): Promise<TeamEntity> {
    return this.teamEntityRepository.manager.transaction(async () => {
      const mergeIntoEntity = await this.selectOne({ id: conditions.id });

      const entity = this.teamEntityRepository.merge(mergeIntoEntity, {
        ...entityLike,
        captain: await this.userService.selectOne({ id: entityLike.captain }),
      });
      return this.teamEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.TEAM_ALREADY_EXISTS);
      });
    });
  }

  public async businessUpdateOne(
    conditions: Partial<TeamEntity>,
    entityLike: UpdateTeamDto,
    options: SaveOptions = { transaction: false }
  ): Promise<TeamEntity> {
    const team = await this.selectOne(conditions);
    const members = await this.getTeamMembers(team);
    if (entityLike.captain && members.indexOf(entityLike.captain) == -1)
      throw new ConflictException(ErrorTypeEnum.PLAYER_NOT_IN_A_TEAM);
    return this.updateOne(conditions, entityLike, options);
  }

  public async businessDeleteOne(
    conditions: Partial<TeamEntity>,
    user: UserEntity
  ): Promise<TeamEntity> {
    const entity = await this.selectOne(conditions);
    if (entity.captain.id != user.id || user.role == RolesEnum.ADMIN)
      throw new ForbiddenException(ErrorTypeEnum.NO_PERMISSIONS)
    return this.deleteOne(conditions);
  }

  public async getTeamMembers(
    entity: Partial<TeamEntity>
  ): Promise<string[]> {
    const relations = entity.members;
    const members: string[] = [];
    for (const relation of relations) {
      const relationEntity = await this.selectOneRelation(relation);
      members.push(relationEntity.user.id);
    }
    return members;
  }

  public async getTeamsByUser(
    entity: Partial<UserEntity>
  ): Promise<string[]> {
    const user = await this.userService.selectOne({ id: entity.id });
    const relations = user.teams;
    const teams: string[] = [];
    for (const relation of relations) {
      const relationEntity = await this.selectOneRelation(relation);
      teams.push(relationEntity.team.id);
    }
    return this.formTeamsByUser(teams);
  }

  public async formTeamsByUser(
    data: string[]
  ): Promise<any> {
    const output = { teams: [] }
    for (const team of data) {
      const curTeam = await this.selectOne({ id: team });
      output.teams.push(curTeam);
    }
    return output;
  }

  public async applyToTeam(
    name: string,
    user: UserEntity,
  ): Promise<TeamEntity> {
    const team = await this.selectOne({ name: name })
    console.log(team)
    const members = await this.getTeamMembers(team);
    console.log(members);
    console.log(members.indexOf(user.id));
    if (members.indexOf(user.id) != -1)
      throw new ConflictException(ErrorTypeEnum.PLAYER_ALREADY_IN_THIS_TEAM);
    await this.createOneRelation(team, user);
    return this.selectOne({ id: team.id });
  }

  private async deleteOne(
    conditions: Partial<TeamEntity>
  ): Promise<TeamEntity> {
    return this.updateOne(conditions, { isDeleted: true });
  }

  public async deleteOneRelation(
    conditions: Partial<TeamRelationEntity>,
    options: RemoveOptions = { transaction: false }
  ): Promise<TeamRelationEntity> {
    return this.teamRelationEntityRepository.manager.transaction(async () => {
      const entity = await this.selectOneRelation(conditions);
      return this.teamRelationEntityRepository.remove(entity, options).catch(() => {
        throw new NotFoundException(ErrorTypeEnum.RELATION_NOT_FOUND);
      });
    });
  }

  public async leaveTeam(
    conditions: Partial<TeamEntity>,
    user: UserEntity,
  ): Promise<TeamRelationEntity> {
    const entity = await this.selectOneRelationByBoth(conditions, user).catch(() => {
      throw new ForbiddenException(ErrorTypeEnum.PLAYER_IN_ANOTHER_TEAM);
    });
    const team = await this.selectOne(conditions);
    const members = await this.getTeamMembers(team);
    return this.deleteOneRelation(entity);
  }
}
