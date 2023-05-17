import { StatusEnum } from '../../../common/enums/status.enum';
import { RolesEnum } from '../../../common/enums/roles.enum';

export class UpdateUserDto {
  public readonly status?: StatusEnum;
  public readonly role?: RolesEnum;
  public readonly firstName?: string;
  public readonly lastName?: string;
}