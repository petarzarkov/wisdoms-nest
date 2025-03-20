import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { ValidatedConfig } from '@const';

@ApiTags('service')
@Controller({
  path: 'service',
})
export class ServiceController {
  constructor(private configService: ConfigService<ValidatedConfig, true>) {}

  @Get('healthcheck')
  @ApiResponse({
    status: 200,
  })
  @ApiOperation({ summary: 'Check if service is healthy' })
  @HealthCheck()
  healthCheck() {
    return {
      isHealthy: true,
    };
  }

  @Get('config')
  @ApiResponse({
    status: 200,
    description: 'Service config',
  })
  config() {
    return {
      version: process.env.npm_package_version,
      app: this.configService.get('app'),
    };
  }

  @Get('upcheck')
  @ApiOperation({ summary: 'Check if service is up' })
  upCheck() {
    return {};
  }
}
