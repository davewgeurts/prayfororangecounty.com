/**
 * UI Event Types for RivePak UI Components
 */
export declare enum UIEventType {
    CHANGE = "ui:change",
    INPUT = "ui:input",
    CLICK = "ui:click",
    DOWN = "ui:down",
    UP = "ui:up",
    PRESS = "ui:press",
    RELEASE = "ui:release",
    OVER = "ui:over",
    OUT = "ui:out",
    FOCUS = "ui:focus",
    BLUR = "ui:blur",
    SELECT = "ui:select",
    DESELECT = "ui:deselect",
    COMPLETE = "ui:complete",
    SUBMIT = "ui:submit",
    SELECTION_CHANGE = "ui:selection_change",
    OPEN = "ui:open",
    CLOSE = "ui:close",
    VALID = "ui:valid",
    INVALID = "ui:invalid",
    ENABLE = "ui:enable",
    DISABLE = "ui:disable",
    SHOW = "ui:show",
    HIDE = "ui:hide",
    ANIMATION_START = "ui:animation_start",
    ANIMATION_END = "ui:animation_end"
}
export interface UIEvent<T = any> {
    type: UIEventType;
    target: any;
    value?: T;
    previousValue?: T;
    data?: any;
    timestamp: number;
}
export interface UIEventHandler<T = any> {
    (event: UIEvent<T>): void;
}
export type ChangeCallback<T = any> = (value: T, component: any) => void;
export type InteractionCallback = (component: any) => void;
export type ValidationCallback = (isValid: boolean, errors: string[]) => void;
