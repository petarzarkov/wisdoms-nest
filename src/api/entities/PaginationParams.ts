import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationParams {
  @IsOptional()
  @ApiProperty({
    example: 0,
    default: 0,
    description: 'determines the starting point in the dataset',
  })
  offset: number = 0;

  @IsOptional()
  @ApiProperty({
    example: 10,
    default: 10,
    description: 'specifies the maximum number of records to include on each page',
  })
  limit: number = 10;
}
