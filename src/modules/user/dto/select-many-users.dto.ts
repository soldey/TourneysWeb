import { FindManyOptionsDto } from '../../../common/dto/find-many-options.dto';
import { UserEntity } from '../entities/user.entity';

export class SelectManyUsersDto extends FindManyOptionsDto<UserEntity> {}