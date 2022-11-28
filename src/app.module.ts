/* eslint-disable @typescript-eslint/indent */
import { Module, OnApplicationBootstrap } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ConfigModule } from "@nestjs/config";
import { WisdomsModule } from "./api/wisdoms/wisdoms.module";
import { defaultConfig } from "@const";
import { ServiceModule } from "@api/service/service.module";
import { join } from "path";
import config from "config";
import { getHost } from "@utils";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [defaultConfig],
            isGlobal: true
        }),
        ServiceModule,
        WisdomsModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "public"),
        }),
    ]
})
export class AppModule implements OnApplicationBootstrap {
    async onApplicationBootstrap() {
        const port = Number(process.env.PORT) || (config?.has("servicePort") ? config?.get<number>("servicePort") : undefined);
        if (port) {
            const host = await getHost();
            const address = `http://${host}:${port}`;
            // const config = BaseModule.config?.configDetails as unknown as Record<string, Record<string, unknown>>;
            // if (typeof config?.app?.apiPath === "string") {
            //     address += `/${config?.app?.apiPath}`;
            // }

            console.log(
                // eslint-disable-next-line max-len
                `[APP] ${process.pid} - ${new Date().toLocaleString()} LOG ${`[${process.env.npm_package_name || "service"}]`} started on ${address}`
            );
        }

    }
}