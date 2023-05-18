import { PaginationMixin } from '../../../common/dto/pagination.dto';
import { TournamentEntity } from '../entities/tournament.entity';

export class PaginationTournamentsDto extends PaginationMixin(TournamentEntity) {
  /**
   * [description]
   * @param result
   * @param total
   */
  constructor([result, total]: [TournamentEntity[], number]) {
    super();
    Object.assign(this, { result, total });
  }
  getResult() {
    return this.result;
  }
}