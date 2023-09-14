import { IsUUID } from 'class-validator';
import { RolesEnum } from '../../../common/enums/roles.enum';

export class JwtValidateResponseDto {
  @IsUUID()
  public readonly id: string;
  public readonly ppid: string;
  public readonly role: RolesEnum;
}