if (process.env.NODE_ENV !== "production") {
    /**
     * Here for debugging purposes,
     * although nest ConfigModule imports it - we need to do earlier here as some of our casino packages can instantly process env vars
     */
    try {
        require("dotenv/config");
    // eslint-disable-next-line no-empty
    } catch (error) {

    }
}
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { API_BEARER_AUTH_DEFAULT_NAME, API_BEARER_AUTH_DEFAULT_TOKEN, DefaultConfig } from "@const";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { RequestIdMiddleware } from "@middlewares";
import { HttpInterceptor } from "@interceptors/http.interceptor";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap(module: typeof AppModule) {
    const app = await NestFactory.create<NestExpressApplication>(module, {
        cors: true,
        bufferLogs: false,
        // logger: new CasinoLogger("play-data-service")
    });
    app.enableShutdownHooks();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    app.use(new RequestIdMiddleware().use);
    app.useGlobalInterceptors(new HttpInterceptor());
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const configService = app.get<ConfigService<DefaultConfig, true>>(ConfigService);
    const apiPath = configService.get("app.apiPath", { infer: true });

    const bearerTokenSchema: Parameters<DocumentBuilder["addBearerAuth"]>[0] = {
        type: "http",
        in: "header",
        scheme: "bearer"
    };

    const config = new DocumentBuilder()
        .addBearerAuth(bearerTokenSchema, API_BEARER_AUTH_DEFAULT_NAME)
        .setTitle(process.env.npm_package_name || process.env.npm_package_description as string)
        .setVersion(process.env.npm_package_version as string);

    if (process.env.npm_package_description) {
        config.setDescription(process.env.npm_package_description);
    }

    config.setContact(
        process.env.npm_package_author_name as string,
        process.env.npm_package_homepage as string,
        process.env.npm_package_author_email as string
    );

    const document = SwaggerModule.createDocument(app, config.build());
    SwaggerModule.setup(apiPath, app, document, {
        // This is so we are automatically authorized in swagger with some default value for the Bearer token
        swaggerOptions: {
            authAction: {
                [API_BEARER_AUTH_DEFAULT_NAME]: {
                    schema: bearerTokenSchema,
                    value: Buffer.from(API_BEARER_AUTH_DEFAULT_TOKEN).toString("base64"),
                },
            },
        },
    });

    const port = configService.get("app.port", { infer: true });
    await app.listen(port);
}

void bootstrap(AppModule);
