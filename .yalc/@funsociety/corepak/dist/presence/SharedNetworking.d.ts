/**
 * Shared Networking & PubSub primitives for @funsociety/corepak/presence.
 * Compatible with TypeScript erasableSyntaxOnly and strict mode.
 */
export declare const NETWORK_STATUS_CODES: {
    readonly _0_UNPROCESSED: 0;
    readonly _200_OK: 200;
    readonly _400_BAD_REQUEST: 400;
    readonly _401_UNAUTHORIZED: 401;
    readonly _403_FORBIDDEN: 403;
    readonly _404_NOT_FOUND: 404;
    readonly _409_CONFLICT: 409;
    readonly _500_INTERNAL_SERVER_ERROR: 500;
    readonly _503_SERVICE_UNAVAILABLE: 503;
};
export type NETWORK_STATUS_CODES = (typeof NETWORK_STATUS_CODES)[keyof typeof NETWORK_STATUS_CODES];
export declare const NETWORK_PAYLOAD_TYPES: {
    readonly NONE: "NONE";
    readonly ERROR: "ERROR";
    readonly SUCCESS: "SUCCESS";
};
export type NETWORK_PAYLOAD_TYPES = (typeof NETWORK_PAYLOAD_TYPES)[keyof typeof NETWORK_PAYLOAD_TYPES];
export declare const NETWORK_ENDPOINTS: {
    readonly PUBLIC: "PUBLIC";
    readonly PRESENCE: "PRESENCE";
    readonly PLEDGES: "PLEDGES";
    readonly DEBUG_PING: "DEBUG_PING";
    readonly DEBUG_REDIS_TEEST: "DEBUG_REDIS_TEST";
    readonly DEBUG_MONGO_TEEST: "DEBUG_MONGO_TEST";
};
export type NETWORK_ENDPOINTS = (typeof NETWORK_ENDPOINTS)[keyof typeof NETWORK_ENDPOINTS];
export declare const NETWORK_COMMANDS: {
    readonly UNDEFINED: "UNDEFINED";
    readonly PRESENCE_HEARTBEAT: "PRESENCE_HEARTBEAT";
    readonly PRESENCE_GONG_RIPPLE: "PRESENCE_GONG_RIPPLE";
    readonly PRESENCE_SEND_HUG: "PRESENCE_SEND_HUG";
    readonly PRESENCE_FETCH: "PRESENCE_FETCH";
};
export type NETWORK_COMMANDS = (typeof NETWORK_COMMANDS)[keyof typeof NETWORK_COMMANDS];
export interface NETWORK_SUCCESS_PAYLOAD<T = unknown> {
    type: typeof NETWORK_PAYLOAD_TYPES.SUCCESS;
    status: NETWORK_STATUS_CODES;
    endpoint?: NETWORK_ENDPOINTS;
    command?: NETWORK_COMMANDS;
    data: T;
    timestamp: number;
}
export interface NETWORK_ERROR_PAYLOAD {
    type: typeof NETWORK_PAYLOAD_TYPES.ERROR;
    status: NETWORK_STATUS_CODES;
    endpoint?: NETWORK_ENDPOINTS;
    command?: NETWORK_COMMANDS;
    error: string;
    timestamp: number;
}
export type NETWORK_PAYLOAD<T = unknown> = NETWORK_SUCCESS_PAYLOAD<T> | NETWORK_ERROR_PAYLOAD;
export declare function createSuccessPayload<T>(data: T, endpoint?: NETWORK_ENDPOINTS, command?: NETWORK_COMMANDS, status?: NETWORK_STATUS_CODES): NETWORK_SUCCESS_PAYLOAD<T>;
export declare function createErrorPayload(error: string, status?: NETWORK_STATUS_CODES, endpoint?: NETWORK_ENDPOINTS, command?: NETWORK_COMMANDS): NETWORK_ERROR_PAYLOAD;
export declare class PubSubChannel<T> {
    private listeners;
    private lastValue;
    subscribe(cb: (data: T) => void): () => void;
    publish(data: T): void;
    getLastValue(): T | undefined;
    clear(): void;
}
