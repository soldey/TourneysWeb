import { PaginationMixin } from '../../../common/dto/pagination.dto';
import { TeamEntity } from '../entities/team.entity';
import { UserEntity } from '../../user/entities/user.entity';

export class PaginationTeamsDto extends PaginationMixin(TeamEntity) {
  /**
   * [description]
   * @param result
   * @param total
   */
  constructor([result, total]: [TeamEntity[], number]) {
    super();
    Object.assign(this, { result, total });
  }
  getResult() {
    return this.result;
  }
}