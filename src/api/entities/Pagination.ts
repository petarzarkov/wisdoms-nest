import { ApiProperty } from '@nestjs/swagger';
import { PaginationParams } from './PaginationParams';

export class Pagination extends PaginationParams {
  @ApiProperty({
    example: 100,
    description: 'the total number of wisdoms',
  })
  total: number;

  @ApiProperty({
    example: 10,
    description: 'indicates remaning wisdoms to be fetched',
  })
  remaining: number;

  @ApiProperty({
    example: '/api/wisdoms?lang=bg&offset=40&limit=10',
    description: 'indicates remaning wisdoms to be fetched',
    nullable: true,
  })
  previous: string | null;

  @ApiProperty({
    example: '/api/wisdoms?lang=bg&offset=60&limit=10',
    description: 'indicates remaning wisdoms to be fetched',
    nullable: true,
  })
  next: string | null;
}
