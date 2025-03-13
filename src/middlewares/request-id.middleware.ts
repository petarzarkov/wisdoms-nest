import { Injectable, NestMiddleware } from '@nestjs/common';
import type { HookHandlerDoneFunction } from 'fastify';
import { v4 } from 'uuid';
import { ServerResponse } from 'http';
import { REQUEST_ID_HEADER_KEY } from '@const';
import { BaseAPIRequest } from '@contracts';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: BaseAPIRequest, res: ServerResponse, next: HookHandlerDoneFunction) {
    const requestId = req?.id || v4();
    req.headers[REQUEST_ID_HEADER_KEY] = requestId;

    res.setHeader(REQUEST_ID_HEADER_KEY, requestId);

    next();
  }
}
