import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamEntity } from './entities/team.entity';
import { RolesEnum } from '../../common/enums/roles.enum';
import { Roles, User } from '../../common/decorators';
import { SelectManyTeamsDto } from './dto/select-many-teams.dto';
import { PaginationTeamsDto } from './dto/pagination-teams.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { ID } from '../../common/dto/id.dto';
import { SelectOneTeamDto } from './dto/select-one-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { UserEntity } from '../user/entities/user.entity';
import { ApplyToTeamDto } from './dto/apply-to-team.dto';

@ApiTags('team')
@Controller('api/v1/team')
@UseInterceptors(ClassSerializerInterceptor)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  public async createOne(
    @Body() data: CreateTeamDto
  ): Promise<TeamEntity> {
    return this.teamService.createOne(data);
  }

  @Get()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  public async selectAll(
    @Query() data: SelectManyTeamsDto
  ): Promise<PaginationTeamsDto> {
    return this.teamService.selectAll(data);
  }

  @Get(':id')
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  public async selectOne(
    @Param('id') conditions: string
  ): Promise<TeamEntity> {
    return this.teamService.selectOne({ id: conditions });
  }

  @Patch(':id')
  @Roles(RolesEnum.USER)
  @UseGuards(RolesGuard)
  public async updateOne(
    @Param('id') conditions: string,
    @Body() data: UpdateTeamDto,
  ): Promise<TeamEntity> {
    return this.teamService.businessUpdateOne({ id: conditions }, data);
  }

  @Delete(':id')
  @Roles(RolesEnum.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async deleteOne(
    @Param(':id') conditions: ID,
    @User() user: UserEntity,
  ): Promise<TeamEntity> {
    return this.teamService.businessDeleteOne(conditions, user);
  }

  @Post('apply')
  @Roles(RolesEnum.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async applyToTeam(
    @Body() data: ApplyToTeamDto,
    @User() user: UserEntity,
  ): Promise<TeamEntity> {
    return this.teamService.applyToTeam(data.name, user);
  }
}