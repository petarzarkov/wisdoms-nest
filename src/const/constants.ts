/**
 * @default "api"
 */
export const API_PREFIX = process.env.API_PREFIX || 'api';

/**
 * @default "wisdoms"
 */
export const WISDOMS_ROUTE = process.env.WISDOMS_ROUTE || 'wisdoms';
/**
 * @default "wisdom"
 */
export const WISDOM_ROUTE = process.env.WISDOM_ROUTE || 'wisdom';

export const REQUEST_ID_HEADER_NAME = 'x-request-id';

/**
 * @default 299,700 ("4.995min")
 */
export const WAKE_UP_INTERVAL = Number(process.env.WAKE_UP_INTERVAL) || 5 * 60 * 999;

export const BEARER_TOKEN_DEFAULT_NAME = 'defaultSwaggerBearerToken';
export const BEARER_TOKEN_DEFAULT = '4a9d201e-c0cc-4c84-a570-84c247e96499';
export const REQUEST_ID_HEADER_KEY = 'x-request-id';
