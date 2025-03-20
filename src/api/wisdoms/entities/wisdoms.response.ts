import { Pagination } from '@api/entities/Pagination';
import { ApiProperty } from '@nestjs/swagger';

export class WisdomResponse {
  @ApiProperty({
    example: "Lying down you can't eat an apple, help yourself and god help you, mind to the ankles.",
    description: 'random wisdom',
  })
  wisdom: string;
}

export class WisdomsResponse {
  @ApiProperty({
    description: 'pagination',
  })
  pagination: Pagination;

  @ApiProperty({
    example: ["Lying down you can't eat an apple, help yourself and god help you, mind to the ankles."],
    description: 'all wisdoms',
  })
  wisdoms: string[];
}
