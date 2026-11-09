/**
 * UI Event Bus - Integrates with RivePak's existing PubSub system
 */
import { CanvasEngineEventBus } from "../../CanvasEngineEventBus";
export class UIEventBus {
    /**
     * Subscribe to a UI event
     */
    static on(eventType, handler, component) {
        const key = component ? `${eventType}:${component.uuid}` : eventType;
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key).add(handler);
        // Also register with main CanvasEngine event bus for global events
        if (!component) {
            CanvasEngineEventBus.on(eventType, handler);
        }
    }
    /**
     * Unsubscribe from a UI event
     */
    static off(eventType, handler, component) {
        const key = component ? `${eventType}:${component.uuid}` : eventType;
        if (this.listeners.has(key)) {
            this.listeners.get(key).delete(handler);
            if (this.listeners.get(key).size === 0) {
                this.listeners.delete(key);
            }
        }
        // Also unregister from main event bus
        if (!component) {
            CanvasEngineEventBus.off(eventType, handler);
        }
    }
    /**
     * Emit a UI event
     */
    static emit(event) {
        // Emit to component-specific listeners
        if (event.target) {
            const componentKey = `${event.type}:${event.target.uuid}`;
            if (this.listeners.has(componentKey)) {
                this.listeners.get(componentKey).forEach(handler => handler(event));
            }
        }
        // Emit to global listeners
        if (this.listeners.has(event.type)) {
            this.listeners.get(event.type).forEach(handler => handler(event));
        }
        // Also emit to main CanvasEngine event bus for global integration
        CanvasEngineEventBus.emit(event.type, event);
    }
    /**
     * Subscribe once to an event
     */
    static once(eventType, handler, component) {
        const wrappedHandler = (event) => {
            handler(event);
            this.off(eventType, wrappedHandler, component);
        };
        this.on(eventType, wrappedHandler, component);
    }
    /**
     * Clear all listeners for a component
     */
    static clearComponentListeners(component) {
        const keysToDelete = [];
        this.listeners.forEach((_, key) => {
            if (key.includes(`:${component.uuid}`)) {
                keysToDelete.push(key);
            }
        });
        keysToDelete.forEach(key => this.listeners.delete(key));
    }
    /**
     * Create a UI event
     */
    static createEvent(type, target, value, previousValue, data) {
        return {
            type,
            target,
            value,
            previousValue,
            data,
            timestamp: Date.now()
        };
    }
}
UIEventBus.listeners = new Map();
