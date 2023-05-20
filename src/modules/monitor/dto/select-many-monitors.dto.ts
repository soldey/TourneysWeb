import { FindManyOptionsDto } from '../../../common/dto/find-many-options.dto';
import { MonitorEntity } from '../entities/monitor.entity';

export class SelectManyMonitorsDto extends FindManyOptionsDto<MonitorEntity> {}