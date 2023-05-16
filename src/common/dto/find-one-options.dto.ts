import { IsArray, IsBooleanString, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { FindOneOptions } from 'typeorm';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * [description]
 */
export class FindOneOptionsDto<Entity> implements FindOneOptions {
  /**
   * Specifies what columns should be retrieved
   */
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => [].concat(value))
  @ApiProperty({
    type: [String],
    description: 'Specifies what columns should be retrieved',
  })
  public readonly select?: [keyof Entity];

  /**
   * Indicates what relations of entity should be loaded (simplified left join form)
   */
  @IsOptional()
  @IsBooleanString()
  @ApiProperty({
    type: 'boolean',
    description: 'Indicates what relations of entity should be loaded',
  })
  public readonly eager?: string;

  /**
   * Getter to form an property of loadEagerRelations. Available after calling classToPlain
   */
  @Expose({ toPlainOnly: true })
  public get loadEagerRelations(): boolean {
    return !!this.eager ? JSON.parse(this.eager) : true;
  }

  /**
   * Enables or disables query result caching.
   */
  @IsOptional()
  @Min(0)
  @ApiProperty({
    type: String,
    description: 'Enables or disables query result caching',
  })
  public readonly cache?: number = null;

  @IsOptional()
  @ApiProperty({ type: Boolean, description: 'Makes query to select existing entities' })
  public readonly isDeleted?: boolean = false;
}
