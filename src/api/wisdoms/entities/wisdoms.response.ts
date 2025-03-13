import { ApiProperty } from '@nestjs/swagger';

export class WisdomResponse {
  @ApiProperty({
    example: "Lying down you can't eat an apple, help yourself and god help you, mind to the ankles.",
    description: 'random wisdom',
  })
  public wisdom: string;
}

export class WisdomsResponse {
  @ApiProperty({
    example: ["Lying down you can't eat an apple, help yourself and god help you, mind to the ankles."],
    description: 'all wisdoms',
  })
  public wisdoms: string[];
}
