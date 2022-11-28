import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

const buildOrigin = (protocol: string, host: string): `${string}://${string}` => `${protocol}://${host}`;

export const Origin = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>();

        const host = request.get("host") || request.hostname;
        // Equivalent to koa's context.origin
        const originalOrigin = buildOrigin(request.protocol, host);

        const xForwardedProto = request.get("x-forwarded-proto");
        const origin = xForwardedProto ? buildOrigin(xForwardedProto, host) : originalOrigin;
        return origin;
    }
);