/* eslint-disable @typescript-eslint/indent */
import { Module } from "@nestjs/common";
import { WisdomsController } from "./wisdoms.controller";
import { WisdomsService } from "./wisdoms.service";

@Module({
    controllers: [WisdomsController],
    providers: [
        WisdomsService
    ],
})
export class WisdomsModule { }
