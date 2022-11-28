import { ApiProperty } from "@nestjs/swagger";
import { BaseResponse } from "@contracts";

export class WisdomResponse extends BaseResponse {
    @ApiProperty({
        example: "Lying down you can't eat an apple, help yourself and god help you, mind to the ankles.",
        description: "random wisdom"
    })
    public wisdom: string;
}

export class WisdomAPIResponse extends BaseResponse {
    @ApiProperty({
        description: "was the processing of the request ok",
        required: false,
        type: "boolean",
        example: true,
    })
    readonly isOk?: boolean;

    @ApiProperty({
        description: "if the processing of the request ok, result will exist",
        required: false,
        type: "object",
        properties: {
            wisdom: { type: "string" }
        }
    })
    readonly result?: {
        wisdom: string;
    };
}

export class WisdomsResponse extends BaseResponse {
    @ApiProperty({
        example: ["Lying down you can't eat an apple, help yourself and god help you, mind to the ankles."],
        description: "all wisdoms"
    })
    public wisdoms: string[];
}

export class WisdomsAPIResponse extends BaseResponse {
    @ApiProperty({
        description: "was the processing of the request ok",
        required: false,
        type: "boolean",
        example: true,
    })
    readonly isOk?: boolean;

    @ApiProperty({
        description: "if the processing of the request ok, result will exist",
        required: false,
        type: "object",
        properties: {
            wisdoms: {
                type: "array",
                items: {
                    type: "string"
                }
            }
        }

    })
    readonly result?: {
        wisdoms: string[];
    };
}