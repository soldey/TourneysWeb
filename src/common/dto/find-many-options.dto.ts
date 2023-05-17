import { FindManyOptions } from 'typeorm';
import { IsArray, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FindOneOptionsDto } from './find-one-options.dto';

/**
 * [description]
 */
export class FindManyOptionsDto<Entity>
  extends FindOneOptionsDto<Entity>
  implements FindManyOptions {
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => [].concat(value))
  @ApiPropertyOptional({
    type: [String],
    description: 'Order, in which entities should be ordered.',
  })
  public readonly asc?: string[];

  /**
   * If the same fields are specified for sorting in two directions, the priority is given to DESC
   */
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => [].concat(value))
  @ApiPropertyOptional({
    type: [String],
    description:
      'If the same fields are specified for sorting in two directions, the priority is given to DESC',
  })
  public readonly desc?: [keyof Entity];

  /**
   * Getter to form an object of order. Available after calling classToPlain
   */
  @Expose({ toPlainOnly: true })
  public get order(): FindManyOptions['order'] {
    return Object.assign(
      {},
      ...(this.asc?.map((key) => ({ [key]: 'ASC' })) || []),
      ...(this.desc?.map((key) => ({ [key]: 'DESC' })) || []),
    );
  }

  /**
   * Offset (paginated) where from entities should be taken
   */
  @IsOptional()
  @Min(1)
  @ApiPropertyOptional({
    type: String,
    default: 1,
    description: 'Offset (paginated) where from entities should be taken',
  })
  public readonly page?: number = 1;

  /**
   * Limit (paginated) - max number of entities should be taken
   */
  @IsOptional()
  @Min(0)
  @Max(50)
  @ApiPropertyOptional({
    type: String,
    default: 50,
    description: 'Limit (paginated) - max number of entities should be taken',
  })
  public readonly take?: number = 50;

  /**
   * Getter to form an object of skip. Available after calling classToPlain
   */
  @Expose({ toPlainOnly: true })
  public get skip(): number {
    return this.take * (this.page - 1);
  }
}
