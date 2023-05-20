import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  ClassSerializerInterceptor,
  Controller, Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { Roles } from '../../common/decorators';
import { RolesEnum } from '../../common/enums/roles.enum';
import { RolesGuard } from '../auth/guards';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { MonitorEntity } from './entities/monitor.entity';
import { SelectOneMonitorDto } from './dto/select-one-monitor.dto';
import { SelectManyMonitorsDto } from './dto/select-many-monitors.dto';
import { PaginationMonitorsDto } from './dto/pagination-monitors.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';

@ApiTags('monitor')
@Controller('api/v1/monitor')
@UseInterceptors(ClassSerializerInterceptor)
export class MonitorController {
  constructor(
    private readonly monitorService: MonitorService,
  ) {}

  @Post()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  public async createOne(
    @Body() data: CreateMonitorDto,
  ): Promise<MonitorEntity> {
    return this.monitorService.createOne(data);
  }

  @Get()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  public async selectOne(
    @Query() data: SelectOneMonitorDto,
  ): Promise<MonitorEntity> {
    return this.monitorService.selectOne({ ...data });
  }

  @Get('all')
  @Roles(RolesEnum.USER)
  @UseGuards(RolesGuard)
  public async selectAll(
    @Query() data: SelectManyMonitorsDto,
  ): Promise<PaginationMonitorsDto> {
    return this.monitorService.selectAll(data);
  }

  @Patch(':id')
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  public async updateOne(
    @Param('id') conditions: string,
    @Body() data: UpdateMonitorDto,
  ): Promise<MonitorEntity> {
    return this.monitorService.updateOne({ id: conditions }, data);
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  public async deleteOne(
    @Param('id') conditions: string,
  ): Promise<MonitorEntity> {
    return this.monitorService.deleteOne({ id: conditions });
  }
}