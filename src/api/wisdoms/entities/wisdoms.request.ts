import { Lang } from "@contracts";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

export class WisdomsRequest {
    @IsEnum(Lang)
    @IsOptional()
    @ApiProperty({
        example: Lang.BG
    })
    readonly lang?: Lang;
}
