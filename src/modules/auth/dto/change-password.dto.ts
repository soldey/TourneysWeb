import { Matches, MaxLength } from 'class-validator';
import { pwdRegExp } from '../../user/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @MaxLength(32)
  @Matches(pwdRegExp)
  @ApiProperty({ example: '123qwe' })
  public readonly oldPassword: string;

  @MaxLength(32)
  @Matches(pwdRegExp)
  @ApiProperty({ example: '123qwe' })
  public readonly newPassword: string;
}