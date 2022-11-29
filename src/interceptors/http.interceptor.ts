import {
    CallHandler,
    ExecutionContext,
    HttpException,
    Injectable,
    NestInterceptor
} from "@nestjs/common";
import { map, catchError, throwError } from "rxjs";
import { Reflector } from "@nestjs/core";
import { ok } from "@toplo/common";
import { HotLogger, IHotLogger } from "@toplo/api";
import { FastifyReply, FastifyRequest } from "fastify";

@Injectable()
export class HttpInterceptor implements NestInterceptor {
    private reflector: Reflector;
    private log: IHotLogger;
    constructor() {
        this.reflector = new Reflector();
    }

    intercept(context: ExecutionContext, next: CallHandler) {
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
        const [req, resp] = context.getArgs<[FastifyRequest<{ Body?: { requestId?: string } }>, FastifyReply]>();
        const eventName = req.url.split("?")?.[0];
        const requestId = req.body?.requestId || req.headers["x-request-id"] as string || req.id as string;

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
                        duration: resp.getResponseTime(),
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
                        duration: resp.getResponseTime(),
                        err,
                        stack: err.stack,
                        data: {
                            request: {
                                body: req.body,
                                query: req.query
                            },
                            error: err
                        }
                    });

                    return throwError(() => {
                        return this.errorResponse(err, requestId);
                    });
                })
            );
    }

    errorResponse(error: Error, requestId: string) {
        const errRes = (error as { response?: Record<string, unknown> })?.response;

        return new HttpException({
            requestId,
            ...errRes
        }, errRes?.status as number || 500);
    }

}
