import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TournamentEntity, TournamentTypeEnum } from './entities/tournament.entity';
import { FindOptionsWhere, RemoveOptions, Repository, SaveOptions } from 'typeorm';
import { TournamentParticipantEntity } from './entities/tournament-participant.entity';
import { TeamService } from '../team/team.service';
import { TeamEntity } from '../team/entities/team.entity';
import { UserService } from '../user/user.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UserEntity } from '../user/entities/user.entity';
import { ErrorTypeEnum } from '../../common/enums/error-type.enum';
import { SelectManyTournamentsDto } from './dto/select-many-tournaments.dto';
import { PaginationTournamentsDto } from './dto/pagination-tournaments.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(TournamentEntity)
    public readonly tournamentEntityRepository: Repository<TournamentEntity>,
    @InjectRepository(TournamentParticipantEntity)
    public readonly tournamentParticipantRepository: Repository<TournamentParticipantEntity>,
    @Inject(forwardRef(() => TeamService))
    private readonly teamService: TeamService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  public async createOne(
    entityLike: CreateTournamentDto,
    host: UserEntity,
    options: SaveOptions = { transaction: false }
  ): Promise<TournamentEntity> {
    return this.tournamentEntityRepository.manager.transaction(async () => {
      const existingTournament = await this.selectOne({ name: entityLike.name }).catch(() => {
        // skip
      });
      if (existingTournament) throw new ConflictException(ErrorTypeEnum.TOURNAMENT_ALREADY_EXISTS);

      const entity = this.tournamentEntityRepository.create({
        ...entityLike,
        host: host,
      });

      return this.tournamentEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.TOURNAMENT_ALREADY_EXISTS);
      });
    });
  }

  public async createOneParticipant(
    conditions: Partial<TournamentEntity>,
    user?: UserEntity,
    team?: Partial<TeamEntity>,
    options: SaveOptions = { transaction: false }
  ): Promise<TournamentParticipantEntity> {
    return this.tournamentParticipantRepository.manager.transaction(async () => {
      const existingParticipant = await this.selectOneParticipantByBoth(conditions, user, team).catch(() => {
        // skip
      });
      console.log(existingParticipant);
      if (existingParticipant) throw new ConflictException(ErrorTypeEnum.PARTICIPANT_ALREADY_EXISTS);
      let entity = undefined;
      if (user)
        entity = this.tournamentParticipantRepository.create(
          {
            tournament: await this.selectOne(conditions),
            user: user,
          }
        );
      else
        entity = this.tournamentParticipantRepository.create(
          {
            tournament: await this.selectOne(conditions),
            team: team,
          }
        );
      return this.tournamentParticipantRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.PARTICIPANT_ALREADY_EXISTS)
      })
    })
  }

  public async selectOneParticipant(
    conditions: Partial<TournamentParticipantEntity>,
  ): Promise<TournamentParticipantEntity> {
    return this.tournamentParticipantRepository
      .createQueryBuilder('participant')
      .leftJoin('participant.team', 'team')
      .leftJoin('participant.user', 'user')
      .leftJoin('participant.tournament', 'tournament')
      .where('participant.id = :participantId', { participantId: conditions.id })
      .select(['participant.id', 'team.id', 'user.id', 'tournament.id'])
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.PARTICIPANT_NOT_FOUND);
      });
  }

  public async selectOneParticipantByBoth(
    conditions: Partial<TournamentEntity>,
    user?: Partial<UserEntity>,
    team?: Partial<TeamEntity>,
  ): Promise<TournamentParticipantEntity> {
    let qb = this.tournamentParticipantRepository
      .createQueryBuilder('participant')
      .leftJoin('participant.team', 'team')
      .leftJoin('participant.user', 'user')
      .leftJoin('participant.tournament', 'tournament')
      .where('tournament.id = :tournamentId', { tournamentId: conditions.id });
    if (user) qb = qb.andWhere('user.id = :userId', { userId: user.id });
    else qb = qb.andWhere('team.id = :teamId', { teamId: team.id });
    return qb.select(['participant.id', 'team.id', 'user.id', 'tournament.id'])
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.PARTICIPANT_NOT_FOUND);
      });
  }


  public async selectOne(
    conditions: Partial<TournamentEntity>,
    eager = true,
  ): Promise<TournamentEntity> {
    return this.tournamentEntityRepository
      .findOneOrFail({
        where: conditions as unknown as FindOptionsWhere<TournamentEntity>,
        relations: [
          'participants',
          'host'
        ],
        loadEagerRelations: eager,
      }).catch(() => {
        throw new NotFoundException(ErrorTypeEnum.TEAM_NOT_FOUND);
      });
  }

  public async selectAll(
    options: SelectManyTournamentsDto,
  ): Promise<PaginationTournamentsDto> {
    return this.tournamentEntityRepository
      .createQueryBuilder('tournament')
      .leftJoinAndSelect('tournament.host', 'host')
      .leftJoinAndSelect('tournament.participants', 'participants')
      .skip(options.skip)
      .take(options.take)
      .getManyAndCount()
      .then((data) => new PaginationTournamentsDto(data))
      .catch();
  }

  public async updateOne(
    conditions: Partial<TournamentEntity>,
    entityLike: UpdateTournamentDto,
    options: SaveOptions = { transaction: false },
  ): Promise<TournamentEntity> {
    return this.tournamentEntityRepository.manager.transaction(async () => {
      const mergeIntoEntity = await this.selectOne({ id: conditions.id });

      const entity = this.tournamentEntityRepository.merge(mergeIntoEntity, {
        ...entityLike,
      });
      return this.tournamentEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.TOURNAMENT_ALREADY_EXISTS);
      });
    });
  }

  public async deleteOne(
    conditions: Partial<TournamentEntity>
  ): Promise<TournamentEntity> {
    return this.updateOne(conditions, { isDeleted: true });
  }

  public async deleteOneParticipant(
    conditions: Partial<TournamentParticipantEntity>,
    options: RemoveOptions = { transaction: false }
  ): Promise<TournamentParticipantEntity> {
    return this.tournamentParticipantRepository.manager.transaction(async () => {
      const entity = await this.selectOneParticipant(conditions);
      return this.tournamentParticipantRepository.remove(entity, options).catch(() => {
        throw new NotFoundException(ErrorTypeEnum.RELATION_NOT_FOUND);
      });
    });
  }

  public async applyToTournament(
    conditions: Partial<TournamentEntity>,
    user?: UserEntity,
    team?: Partial<TeamEntity>,
  ): Promise<TournamentParticipantEntity> {
    const tournamentEntity = await this.selectOne(conditions);
    if (user && tournamentEntity.type == TournamentTypeEnum.TEAM)
      throw new ConflictException(ErrorTypeEnum.APPLICATION_OF_WRONG_TYPE)
    if (team && tournamentEntity.type == TournamentTypeEnum.SOLO)
      throw new ConflictException(ErrorTypeEnum.APPLICATION_OF_WRONG_TYPE);
    if (team) team = await this.teamService.selectOne(team);
    const relation = await this.selectOneParticipantByBoth(conditions, user, team).catch(() => {
      // skip
    });
    console.log(relation)
    return this.createOneParticipant(conditions, user, team);
  }
}