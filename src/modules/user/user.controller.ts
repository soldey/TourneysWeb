import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { SelectManyUsersDto } from './dto/select-many-users.dto';

@ApiTags('user')
@Controller('user')
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
  public async selectAll(@Query() options: SelectManyUsersDto) {
    return this.userService.selectMany(options);
  }

  @Get(':id')
  public async selectOne(@Param('id') id: string) {
    return this.userService.selectOne({ where: { id: id } });
  }

  @Delete(':id')
  public async deleteOne(
    @Param('id') id: string
  ): Promise<UserEntity> {
    return this.userService.deleteOne({ where: { id: id } });
  }
}