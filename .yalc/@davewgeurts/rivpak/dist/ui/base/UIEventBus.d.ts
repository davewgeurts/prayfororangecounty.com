/**
 * UI Event Bus - Integrates with RivePak's existing PubSub system
 */
import { UIEvent, UIEventHandler, UIEventType } from "./UIEventTypes";
export declare class UIEventBus {
    private static listeners;
    /**
     * Subscribe to a UI event
     */
    static on(eventType: UIEventType | string, handler: UIEventHandler, component?: any): void;
    /**
     * Unsubscribe from a UI event
     */
    static off(eventType: UIEventType | string, handler: UIEventHandler, component?: any): void;
    /**
     * Emit a UI event
     */
    static emit(event: UIEvent): void;
    /**
     * Subscribe once to an event
     */
    static once(eventType: UIEventType | string, handler: UIEventHandler, component?: any): void;
    /**
     * Clear all listeners for a component
     */
    static clearComponentListeners(component: any): void;
    /**
     * Create a UI event
     */
    static createEvent<T = any>(type: UIEventType, target: any, value?: T, previousValue?: T, data?: any): UIEvent<T>;
}
