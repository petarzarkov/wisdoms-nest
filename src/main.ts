import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { v4 } from 'uuid';
import { BEARER_TOKEN_DEFAULT, BEARER_TOKEN_DEFAULT_NAME, REQUEST_ID_HEADER_KEY, ValidatedConfig } from '@const';
import { UnhandledRoutes } from '@filters/unhandled-routes';
import { name, description, author, homepage, version } from '../package.json';

async function bootstrap(module: typeof AppModule) {
  const logger = new ConsoleLogger({
    context: name,
    json: true,
  });
  const app = await NestFactory.create<NestFastifyApplication>(
    module,
    new FastifyAdapter({
      requestIdHeader: REQUEST_ID_HEADER_KEY,
      genReqId: () => v4(),
    }),
    {
      logger,
    },
  );

  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const configService = app.get(ConfigService<ValidatedConfig, true>);
  const appConfig = configService.get('app', { infer: true });
  const appEnv = configService.get('env', { infer: true });

  app.useGlobalFilters(new UnhandledRoutes());

  app.enableShutdownHooks();

  const bearerTokenSchema: Parameters<DocumentBuilder['addBearerAuth']>[0] = {
    type: 'http',
    in: 'header',
    scheme: 'bearer',
  };

  const config = new DocumentBuilder()
    .setTitle(name)
    .setVersion(version)
    .setDescription(description)
    .setContact(author.name, homepage, author.email)
    .addBearerAuth(bearerTokenSchema, BEARER_TOKEN_DEFAULT_NAME);

  const document = SwaggerModule.createDocument(app, config.build());

  SwaggerModule.setup(appConfig.docs.apiPath, app, document, {
    customSiteTitle: `NestJS Wisdoms API ${appEnv}`,
    customCss: '.swagger-ui .topbar { display: none }',
    // This is so we are automatically authorized in swagger with some default value for the Bearer token
    swaggerOptions: {
      authAction: {
        [BEARER_TOKEN_DEFAULT_NAME]: {
          schema: bearerTokenSchema,
          value: Buffer.from(BEARER_TOKEN_DEFAULT).toString('base64'),
        },
      },
    },
  });

  app.enableCors();

  await app.listen(appConfig.port, '0.0.0.0');

  const appUrl = await app.getUrl();
  logger.log(`Application started at ${appUrl}`);
  logger.log(`API Docs at ${appUrl}/${appConfig.docs.apiPath}`);
}

void bootstrap(AppModule);
