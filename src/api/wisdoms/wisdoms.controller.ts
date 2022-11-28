import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { WisdomsRequest } from "./entities/wisdoms.request";
import { WisdomResponse, WisdomAPIResponse, WisdomsAPIResponse, WisdomsResponse } from "./entities/wisdoms.response";
import { WisdomsService } from "./wisdoms.service";
import { API_PREFIX, WISDOMS_ROUTE, WISDOM_ROUTE } from "@const";

@ApiTags(API_PREFIX)
@Controller({
    path: API_PREFIX
})
export class WisdomsController {
    constructor(private readonly outcomeService: WisdomsService) { }

    @Get(WISDOM_ROUTE)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get a random wisdom" })
    @ApiResponse({
        status: HttpStatus.OK,
        type: WisdomAPIResponse,
    })
    async getWisdom(@Query() req: WisdomsRequest): Promise<WisdomResponse> {
        return this.outcomeService.getWisdom(req);
    }

    @Get(WISDOMS_ROUTE)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Get all wisdoms" })
    @ApiResponse({
        status: HttpStatus.OK,
        type: WisdomsAPIResponse,
    })
    async getWisdoms(@Query() req: WisdomsRequest): Promise<WisdomsResponse> {
        return this.outcomeService.getWisdoms(req);
    }
}
