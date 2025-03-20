import { Lang } from '@api/entities/Lang';
import { PaginationParams } from '@api/entities/PaginationParams';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class WisdomRequestParams {
  @IsEnum(Lang)
  @IsOptional()
  @ApiProperty({
    example: Lang.BG,
    default: Lang.EN,
  })
  lang: Lang = Lang.EN;
}

export class WisdomsRequestParams extends PaginationParams {
  @IsEnum(Lang)
  @IsOptional()
  @ApiProperty({
    example: Lang.BG,
    default: Lang.EN,
  })
  lang: Lang = Lang.EN;
}
