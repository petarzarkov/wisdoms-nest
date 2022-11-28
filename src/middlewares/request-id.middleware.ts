import { Injectable, NestMiddleware } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";
import { v4, validate } from "uuid";
import { REQUEST_ID_HEADER_NAME } from "@const";

export const obtainRequestId = (req: Request<unknown, unknown, { requestId?: string }>) => {
    try {
        const bodyReqId = req?.body?.requestId && validate(req?.body?.requestId) ? req?.body?.requestId : null;
        if (bodyReqId) {
            return bodyReqId;
        }

        const headerReqId = req.get(REQUEST_ID_HEADER_NAME);
        const validHeaderReqId = headerReqId && validate(headerReqId) ? headerReqId : null;
        const requestId = bodyReqId || validHeaderReqId ||  v4();
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
    use(req: Request<unknown, unknown, { requestId?: string }>, res: Response, next: NextFunction) {
        const requestId = obtainRequestId(req);
        req.headers[REQUEST_ID_HEADER_NAME] = requestId;
        res.set(REQUEST_ID_HEADER_NAME, requestId);

        next();
    }
}
