import { PaginationMixin } from '../../../common/dto/pagination.dto';
import { MonitorEntity } from '../entities/monitor.entity';

export class PaginationMonitorsDto extends PaginationMixin(MonitorEntity) {
  /**
   * [description]
   * @param result
   * @param total
   */
  constructor([result, total]: [MonitorEntity[], number]) {
    super();
    Object.assign(this, { result, total });
  }
  getResult() {
    return this.result;
  }
}