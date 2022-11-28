import { WAKE_UP_INTERVAL } from "@const";
import { Module } from "@nestjs/common";
import { HotLogger, HotRequests } from "@toplo/api";

const log = new HotLogger("WakeUp");

@Module({})
export class WakeUpModule {
    init(url: string) {
        log.info("Starting wake up interval", {
            WAKE_UP_INTERVAL
        });
        setInterval(() => {
            void HotRequests.get({
                url,
                options: {
                    path: "/service/healthcheck",
                    logger: log
                }
            });
        }, WAKE_UP_INTERVAL);
    }
}