import { ApiProperty } from '@nestjs/swagger';
import { RolesEnum } from '../../../common/enums/roles.enum';
import { IsEmail, IsEnum, Matches, MaxLength, MinLength } from 'class-validator';

export const pwdRegExp = '^(?=.*[0-9])(?=.*[a-z]).{8,32}$';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ type: String, example: "asd@d.com" })
  public readonly email: string;

  @MaxLength(32)
  @Matches(pwdRegExp)
  @ApiProperty({ minLength: 6, maxLength: 32, example: '123qwe', default: null })
  public readonly password?: string;

  @IsEnum(RolesEnum)
  @ApiProperty({ enum: RolesEnum, example: RolesEnum.USER })
  public readonly role?: RolesEnum = RolesEnum.USER;

  @MinLength(1)
  @MaxLength(50)
  @ApiProperty({ type: String, example: "John" })
  public readonly firstName: string;

  @MinLength(1)
  @MaxLength(50)
  @ApiProperty({ type: String, example: "Doe" })
  public readonly lastName: string;
}
