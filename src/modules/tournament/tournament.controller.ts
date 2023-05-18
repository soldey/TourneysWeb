import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  ClassSerializerInterceptor,
  Controller, Delete,
  Get, Param, Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { Roles, User } from '../../common/decorators';
import { RolesEnum } from '../../common/enums/roles.enum';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { UserEntity } from '../user/entities/user.entity';
import { ID } from '../../common/dto/id.dto';
import { TournamentEntity } from './entities/tournament.entity';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { SelectManyTournamentsDto } from './dto/select-many-tournaments.dto';
import { PaginationTournamentsDto } from './dto/pagination-tournaments.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

@ApiTags('tournament')
@Controller('api/v1/tournament')
@UseInterceptors(ClassSerializerInterceptor)
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Post()
  @Roles(RolesEnum.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async createOne(
    @Body() data: CreateTournamentDto,
    @User() host: UserEntity,
  ): Promise<TournamentEntity> {
    return this.tournamentService.createOne(data, host);
  }

  @Get()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  public async selectAll(
    @Query() data: SelectManyTournamentsDto
  ): Promise<PaginationTournamentsDto> {
    return this.tournamentService.selectAll(data);
  }

  @Get(':id')
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  public async selectOne(
    @Param('id') conditions: string
  ): Promise<TournamentEntity> {
    return this.tournamentService.selectOne({ id: conditions });
  }

  @Patch(':id')
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  public async updateOne(
    @Param('id') conditions: string,
    @Body() data: UpdateTournamentDto,
  ): Promise<TournamentEntity> {
    return this.tournamentService.updateOne({ id: conditions }, data);
  }

  @Delete(':id')
  @Roles(RolesEnum.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async deleteOne(
    @Param(':id') conditions: ID,
    @User() user: UserEntity,
  ): Promise<TournamentEntity> {
    return this.tournamentService.deleteOne(conditions);
  }
}