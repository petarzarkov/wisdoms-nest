import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { WisdomsModule } from './api/wisdoms/wisdoms.module';
import { ServiceModule } from '@api/service/service.module';
import { join } from 'path';
import { validateConfig } from './const/config';
import { resolve } from 'node:path';
import { RequestIdMiddleware, HttpMiddleware } from '@middlewares';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve('../../', '.env'),
      validate: validateConfig,
      isGlobal: true,
    }),
    ServiceModule,
    WisdomsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../public'),
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware, HttpMiddleware).forRoutes('*');
  }
}
