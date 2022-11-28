import {
    CallHandler,
    ExecutionContext,
    HttpStatus,
    Injectable,
    NestInterceptor
} from "@nestjs/common";
import { map, catchError, throwError } from "rxjs";
import type { Request, Response } from "express";
import { Reflector } from "@nestjs/core";
import { obtainRequestId } from "@middlewares";
import { fail, ok } from "@toplo/common";
import { HotLogger, HotWatch, IHotLogger } from "@toplo/api";

export type InterceptedError = Partial<Error> & {
    errors?: { message: string }[];
    response?: Record<string, unknown>;
    responseDetails?: Record<string, unknown>;
    overrideStatus?: HttpStatus;
};

@Injectable()
export class HttpInterceptor implements NestInterceptor {
    private reflector: Reflector;
    private log: IHotLogger;
    constructor() {
        this.reflector = new Reflector();
    }

    intercept(context: ExecutionContext, next: CallHandler) {
        const sw = new HotWatch();
        const instance = context.getClass();
        const handler = context.getHandler();
        // Order matters, we want handlers to override the class decorator
        const reflectTargets = [instance, handler];

        const skipIntercepting = this.reflector.getAllAndOverride<boolean | undefined>("skipHttpIntercepting", reflectTargets);
        if (skipIntercepting) {
            return next.handle();
        }

        const codeContext = `${instance.name}/${handler.name}`;
        this.log = HotLogger.createLogger(codeContext);
        const [req, resp] = context.getArgs<[Request<unknown, unknown, { requestId?: string }>, Response]>();
        const eventName = req.url.split("?")?.[0];
        const requestId = obtainRequestId(req);

        this.log.info("Request received", {
            requestId,
            eventName,
            method: req.method,
            data: {
                request: {
                    body: req.body,
                    query: req.query
                }
            }
        });

        return next
            .handle()
            .pipe(
                map((response: Record<string, unknown>) => {
                    this.log.info("Response sent", {
                        requestId,
                        eventName,
                        method: req.method,
                        duration: sw.getElapsedMs(),
                        data: {
                            request: {
                                body: req.body,
                                query: req.query
                            },
                            statusCode: resp.statusCode,
                            response
                        }
                    });

                    if (response && typeof response === "object") {
                        if (!response.requestId) {
                            response.requestId = requestId;
                        }

                        const { requestId: requestIdToBeOnTop, ...rest } = response;
                        return {
                            requestId: requestIdToBeOnTop,
                            ...ok(rest)
                        };
                    }

                    return response;
                }),
                catchError((err: Error) => {
                    this.log.error("Response sent", {
                        requestId,
                        eventName,
                        method: req.method,
                        duration: sw.getElapsedMs(),
                        err,
                        stack: err.stack,
                        data: {
                            request: {
                                body: req.body,
                                query: req.query
                            },
                        }
                    });

                    return throwError(() => {
                        return this.errorResponse(err, requestId);
                    });
                })
            );
    }

    errorResponse(_error: Error, requestId: string) {
        return {
            requestId,
            ...fail("Interal Error")
        };
    }

}
