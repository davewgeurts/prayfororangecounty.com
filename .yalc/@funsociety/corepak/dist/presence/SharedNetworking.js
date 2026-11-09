/**
 * Shared Networking & PubSub primitives for @funsociety/corepak/presence.
 * Compatible with TypeScript erasableSyntaxOnly and strict mode.
 */
export const NETWORK_STATUS_CODES = {
    _0_UNPROCESSED: 0,
    _200_OK: 200,
    _400_BAD_REQUEST: 400,
    _401_UNAUTHORIZED: 401,
    _403_FORBIDDEN: 403,
    _404_NOT_FOUND: 404,
    _409_CONFLICT: 409,
    _500_INTERNAL_SERVER_ERROR: 500,
    _503_SERVICE_UNAVAILABLE: 503,
};
export const NETWORK_PAYLOAD_TYPES = {
    NONE: "NONE",
    ERROR: "ERROR",
    SUCCESS: "SUCCESS",
};
export const NETWORK_ENDPOINTS = {
    PUBLIC: "PUBLIC",
    PRESENCE: "PRESENCE",
    PLEDGES: "PLEDGES",
    DEBUG_PING: "DEBUG_PING",
    DEBUG_REDIS_TEEST: "DEBUG_REDIS_TEST",
    DEBUG_MONGO_TEEST: "DEBUG_MONGO_TEST",
};
export const NETWORK_COMMANDS = {
    UNDEFINED: "UNDEFINED",
    PRESENCE_HEARTBEAT: "PRESENCE_HEARTBEAT",
    PRESENCE_GONG_RIPPLE: "PRESENCE_GONG_RIPPLE",
    PRESENCE_SEND_HUG: "PRESENCE_SEND_HUG",
    PRESENCE_FETCH: "PRESENCE_FETCH",
};
export function createSuccessPayload(data, endpoint, command, status = NETWORK_STATUS_CODES._200_OK) {
    return {
        type: NETWORK_PAYLOAD_TYPES.SUCCESS,
        status,
        endpoint,
        command,
        data,
        timestamp: Date.now(),
    };
}
export function createErrorPayload(error, status = NETWORK_STATUS_CODES._500_INTERNAL_SERVER_ERROR, endpoint, command) {
    return {
        type: NETWORK_PAYLOAD_TYPES.ERROR,
        status,
        endpoint,
        command,
        error,
        timestamp: Date.now(),
    };
}
export class PubSubChannel {
    listeners = new Set();
    lastValue = undefined;
    subscribe(cb) {
        this.listeners.add(cb);
        return () => {
            this.listeners.delete(cb);
        };
    }
    publish(data) {
        this.lastValue = data;
        const snapshot = Array.from(this.listeners);
        for (const listener of snapshot) {
            try {
                listener(data);
            }
            catch (err) {
                console.error("[PubSubChannel] Listener error:", err);
            }
        }
    }
    getLastValue() {
        return this.lastValue;
    }
    clear() {
        this.listeners.clear();
    }
}
