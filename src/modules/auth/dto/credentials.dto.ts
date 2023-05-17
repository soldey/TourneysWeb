import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../../user';

/**
 * [description]
 */
export class CredentialsDto extends PickType(CreateUserDto, ['email', 'password']) {}