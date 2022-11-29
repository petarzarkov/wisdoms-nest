if (process.env.NODE_ENV !== "production") {
    // Here for debugging purposes
    try {
        require("dotenv/config");
    } catch (error) {
        console.error("Error importing dotenv/config", { error });
    }
}
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { API_BEARER_AUTH_DEFAULT_NAME, API_BEARER_AUTH_DEFAULT_TOKEN, DefaultConfig } from "@const";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { HttpInterceptor } from "@interceptors/http.interceptor";
import { ValidationPipe } from "@nestjs/common";
import { NestFastifyApplication, FastifyAdapter } from "@nestjs/platform-fastify";
import { v4 } from "uuid";
import { RequestIdMiddleware } from "@interceptors/request-id.middleware";

async function bootstrap(module: typeof AppModule) {
    const app = await NestFactory.create<NestFastifyApplication>(module, new FastifyAdapter({
        requestIdHeader: "x-request-id",
        genReqId: () => v4()
    }));

    app.enableShutdownHooks();
    app.useGlobalInterceptors(new HttpInterceptor());
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    // eslint-disable-next-line @typescript-eslint/unbound-method
    app.use(new RequestIdMiddleware().use);
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
    await app.listen(port, "0.0.0.0");
}

void bootstrap(AppModule);
