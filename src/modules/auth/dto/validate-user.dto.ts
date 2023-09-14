import { IsUUID } from 'class-validator';
import { RolesEnum } from '../../../common/enums/roles.enum';
import { StatusEnum } from '../../../common/enums/status.enum';

export class ValidateUserDto {
  @IsUUID()
  public readonly id?: string;
  public readonly ppid?: string;
  public readonly status?: StatusEnum;
  public readonly email?: string;
}