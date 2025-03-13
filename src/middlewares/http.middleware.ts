import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { REQUEST_ID_HEADER_KEY } from '@const';
import { BaseAPIRequest } from '@contracts';

@Injectable()
export class HttpMiddleware implements NestMiddleware {
  private logger = new Logger(this.constructor.name);

  use(req: BaseAPIRequest, res: FastifyReply['raw'], next: HookHandlerDoneFunction) {
    const { method, originalUrl: url } = req;
    const requestId = req.headers[REQUEST_ID_HEADER_KEY] as string;

    this.logger.log({
      message: `<- ${method} ${url}`,
      requestId,
      request: {
        method: req.method,
        url,
        ...(!!req.query && {
          query: req.query,
        }),
        ...(!!req.body && {
          body: req.body,
        }),
      },
    });

    res.on('finish', () => {
      const { statusCode } = res;

      this.logger.log({
        message: `-> ${method} ${url} ${statusCode}`,
        requestId,
        response: {},
      });
    });

    next();
  }
}
