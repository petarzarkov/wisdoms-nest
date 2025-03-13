import { Lang } from '@contracts';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class WisdomsRequestParams {
  @IsEnum(Lang)
  @IsOptional()
  @ApiProperty({
    example: Lang.BG,
    default: Lang.EN,
  })
  lang: Lang = Lang.EN;
}
