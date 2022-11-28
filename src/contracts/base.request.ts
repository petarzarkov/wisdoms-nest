import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";

export class BaseRequest {
    @IsUUID(4)
    @IsOptional()
    @ApiProperty({
        description: "requestId",
        required: false,
        type: "string",
        format: "uuid",
        example: "4a9d201e-c0cc-4c84-a570-84c247e96499",
    })
    readonly requestId?: string;
}
