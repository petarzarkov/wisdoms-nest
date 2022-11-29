import { Injectable, NestMiddleware } from "@nestjs/common";
import type { FastifyRequest, HookHandlerDoneFunction } from "fastify";
import type { ServerResponse } from "http";
import { v4, validate } from "uuid";
import { REQUEST_ID_HEADER_NAME } from "../const";

export const obtainRequestId = (req: FastifyRequest<{ Body?: { requestId?: string } }>) => {
    try {
        const bodyReqId = req?.body?.requestId && validate(req?.body?.requestId) ? req?.body?.requestId : null;
        if (bodyReqId) {
            return bodyReqId;
        }

        const headerReqId = req.headers["x-request-id"] as string;
        const validHeaderReqId = headerReqId && validate(headerReqId) ? headerReqId : null;
        const requestId = bodyReqId || validHeaderReqId || v4();
        if (req?.body?.requestId) {
            req.body.requestId = requestId;
        }

        return requestId;
    } catch (error) {
        return v4();
    }
};

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    use(req: FastifyRequest<{ Body?: { requestId?: string } }>, res: ServerResponse, next: HookHandlerDoneFunction) {
        const requestId = obtainRequestId(req);
        req.headers[REQUEST_ID_HEADER_NAME] = requestId;

        res.setHeader(REQUEST_ID_HEADER_NAME, requestId);

        next();
    }
}
