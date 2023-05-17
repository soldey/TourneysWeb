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
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { SelectManyUsersDto } from './dto/select-many-users.dto';
import { Roles } from '../../common/decorators';
import { RolesEnum } from '../../common/enums/roles.enum';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('user')
@Controller('api/v1/user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post()
  public async createUser(
    @Body() data: CreateUserDto
  ): Promise<UserEntity> {
    return this.userService.createOne(data);
  }

  @Get()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async selectAll(@Query() options: SelectManyUsersDto) {
    return this.userService.selectMany(options);
  }

  @Get(':id')
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async selectOneById(@Param('id') id: string) {
    return this.userService.selectOne({ id: id });
  }

  @Patch(':id')
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async updateOne(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.updateOne({ id: id }, data);
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async deleteOne(
    @Param('id') id: string
  ): Promise<UserEntity> {
    return this.userService.deleteOne({ id: id });
  }
}