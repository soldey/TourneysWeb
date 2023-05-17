import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto, UserService } from '../user';
import { AuthService } from './auth.service';
import { ChangePasswordDto, CredentialsDto, JwtResponseDto } from './dto';
import { JwtAuthGuard } from './guards';
import { UserEntity } from '../user/entities/user.entity';
import { User } from '../../common/decorators';

@ApiTags('auth')
@Controller('api/v1/auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signin')
  public async createToken(@Body() data: CredentialsDto): Promise<JwtResponseDto> {
    return this.authService.createToken(data);
  }

  @Post('signup')
  public async createUser(@Body() data: CreateUserDto): Promise<JwtResponseDto> {
    return this.authService.createUser(data);
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async selectUser(@User() user: UserEntity): Promise<UserEntity> {
    return user;
  }

  @Patch('change-password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async changeUserPassword(
    @User() user: UserEntity,
    @Body() data: ChangePasswordDto,
  ): Promise<JwtResponseDto> {
    return this.authService.changePassword(user, data);
  }
}