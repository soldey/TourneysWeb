/**
 * [description]
 */
import { PaginationMixin } from '../../../common/dto/pagination.dto';
import { UserEntity } from '../entities/user.entity';

export class PaginationUsersDto extends PaginationMixin(UserEntity) {
  /**
   * [description]
   * @param result
   * @param total
   */
  constructor([result, total]: [UserEntity[], number]) {
    super();
    Object.assign(this, { result, total });
  }
  getResult() {
    return this.result;
  }
}