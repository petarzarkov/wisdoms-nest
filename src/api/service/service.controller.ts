import { Controller, Get, Inject } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags, } from "@nestjs/swagger";
import { HealthCheck } from "@nestjs/terminus";
import { ConfigService } from "@nestjs/config";

@ApiTags("service")
@Controller({
    path: "service"
})
export class ServiceController {
    constructor(
        @Inject(ConfigService)
        public configService: ConfigService
    ) { }

    @Get("healthcheck")
    @ApiResponse({
        status: 200
    })
    @ApiOperation({ summary: "Check if service is healthy" })
    @HealthCheck()
    healthCheck() {
        return {
            isHealthy: true
        };
    }

    @Get("configcheck")
    @ApiResponse({
        status: 200,
        description: "Service config"
    })
    config() {
        return {
            version: process.env.npm_package_version,
            ...this.configService
        };
    }

    @Get("upcheck")
    @ApiOperation({ summary: "Check if service is up" })
    upCheck() {
        return true;
    }
}

