import { FastifyRequest } from 'fastify';

export type BaseAPIRequest<Body = unknown, Query = unknown> = FastifyRequest<{ Body?: Body; Querystring?: Query }>;
