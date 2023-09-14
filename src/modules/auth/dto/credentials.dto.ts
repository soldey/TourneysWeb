import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../../user/dto/create-user.dto';

/**
 * [description]
 */
export class CredentialsDto extends PickType(CreateUserDto, ['email', 'password']) {}