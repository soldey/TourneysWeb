import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '../../config';
import { CreateUserDto, UserService } from '../user';
import { JwtService } from '@nestjs/jwt';
import { Chance } from 'chance';
import { UserEntity } from '../user/entities/user.entity';
import { JwtResponseDto } from './dto/jwt-response.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { ErrorTypeEnum } from '../../common/enums/error-type.enum';
import { StatusEnum } from '../../common/enums/status.enum';
import { ValidateUserDto } from './dto/validate-user.dto';
import { ChangePasswordDto } from './dto';

@Injectable()
export class AuthService {
  private readonly chance;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    this.chance = new Chance();
  }

  public generateToken({ id, ppid, role }: UserEntity): JwtResponseDto {
    const expiresIn = this.configService.get<number>('PASSPORT_EXPIRES');
    const token = this.jwtService.sign({ id, ppid, role });
    return { expiresIn, token, role };
  }

  public async createToken({ email, password }: CredentialsDto): Promise<JwtResponseDto> {
    const user = await this.validateUser({ email: email });

    await user.comparePassword(password).catch(() => {
      throw new UnauthorizedException(ErrorTypeEnum.AUTH_INCORRECT_CREDENTIALS);
    })

    return this.generateToken(user);
  }

  public async createUser(data: Partial<CreateUserDto>): Promise<JwtResponseDto> {
    let isUserExists = false;
    await this.userService
      .selectOne({ email: data.email })
      .then(() => {
        isUserExists = true;
      })
      .catch(() => {
        // skip if doesn't exist
      });

    if (!isUserExists) {
      const createdUser = await this.userService
        .createOne({
          ...data,
          status: StatusEnum.ACTIVATED,
        })
        .catch(() => {
          throw new UnauthorizedException(ErrorTypeEnum.USER_ALREADY_EXISTS);
        });
      return this.generateToken(createdUser);
    }
    throw new ConflictException(ErrorTypeEnum.USER_ALREADY_EXISTS);
  }

  public async changePassword(user: UserEntity, data: ChangePasswordDto): Promise<JwtResponseDto> {
    return this.userService.userEntityRepository.manager.transaction(async () => {
      const check = user.comparePassword(data.oldPassword).catch(() => {
        throw new NotFoundException(ErrorTypeEnum.AUTH_PASSWORDS_DO_NOT_MATCH);
      });
      if (await check) {
        const updatedResult = await this.userService.updateOne(
          { id: user.id },
          { password: data.newPassword },
        );
        return this.generateToken(updatedResult);
      }
    })
  }

  public async validateUser(data: ValidateUserDto): Promise<UserEntity> {
    return this.userService.selectOne(data).catch(() => {
      throw new UnauthorizedException(ErrorTypeEnum.AUTH_INCORRECT_CREDENTIALS);
    });
  }
}