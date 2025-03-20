import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WisdomRequestParams, WisdomsRequestParams } from './entities/wisdoms.request';
import { WisdomResponse, WisdomsResponse } from './entities/wisdoms.response';
import { WisdomsService } from './wisdoms.service';
import { API_PREFIX, WISDOMS_ROUTE, WISDOM_ROUTE } from '@const';

@ApiTags(API_PREFIX)
@Controller({
  path: API_PREFIX,
})
export class WisdomsController {
  constructor(private readonly wisdomsService: WisdomsService) {}

  @Get(WISDOM_ROUTE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a random wisdom' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: WisdomResponse,
  })
  async getWisdom(@Query() req: WisdomRequestParams): Promise<WisdomResponse> {
    return this.wisdomsService.getWisdom(req);
  }

  @Get(WISDOMS_ROUTE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get paginated wisdoms' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: WisdomsResponse,
  })
  async getWisdoms(@Query() req: WisdomsRequestParams): Promise<WisdomsResponse> {
    return this.wisdomsService.getWisdoms(req);
  }
}
