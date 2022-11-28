/* eslint-disable @typescript-eslint/indent */
import { Module } from "@nestjs/common";
import { ServiceController } from "./service.controller";

@Module({
    controllers: [ServiceController]
})
export class ServiceModule { }
