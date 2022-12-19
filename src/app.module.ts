import { Inject, Module, OnApplicationBootstrap } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WisdomsModule } from "./api/wisdoms/wisdoms.module";
import { DefaultConfig, defaultConfig } from "@const";
import { ServiceModule } from "@api/service/service.module";
import { join } from "path";
import config from "config";
import { getHost } from "@utils";
// import { WakeUpModule } from "@modules/wake/wake-up.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [defaultConfig],
            isGlobal: true
        }),
        ServiceModule,
        WisdomsModule,
        // WakeUpModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "public"),
        }),
    ]
})
export class AppModule implements OnApplicationBootstrap {
    constructor(
        @Inject(ConfigService)
        public configService: ConfigService<DefaultConfig, true>
    ) { }

    async onApplicationBootstrap() {
        const port = Number(process.env.PORT) || (config?.has("servicePort") ? config?.get<number>("servicePort") : undefined);
        if (port) {
            const host = await getHost();
            let address = `http://${host}:${port}`;
            if (this.configService.get("app.apiPath", { infer: true })) {
                address += `/${this.configService.get("app.apiPath", { infer: true })}`;
            }

            console.log(
                "\x1b[35m",
                `[APP] ${process.pid} - ${new Date().toLocaleString()} LOG ${`[${process.env.npm_package_name || "service"}]`} started on ${address}`
            );

            // new WakeUpModule().init(`http://${host}:${port}`);
        }

    }
}