import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';

/**
 * [description]
 */
export class JwtResponseDto extends PickType(UserEntity, ['role']) {
  /**
   * [description]
   */
  @ApiProperty({ example: 43200 })
  public readonly expiresIn: number;

  /**
   * [description]
   */
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IlVTRVIiLCJpYXQiOjE2MDQzMjg4NjUsImV4cCI6MTYwNDM3MjA2NX0.6p_fTH5QqW7LePIMQ_QrYSg5DTnfTAoMQnqQnxFI1L0',
  })
  public readonly token: string;
}
