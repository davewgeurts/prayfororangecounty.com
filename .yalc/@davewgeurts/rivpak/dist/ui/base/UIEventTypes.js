/**
 * UI Event Types for RivePak UI Components
 */
export var UIEventType;
(function (UIEventType) {
    // Value change events
    UIEventType["CHANGE"] = "ui:change";
    UIEventType["INPUT"] = "ui:input";
    // Interaction events
    UIEventType["CLICK"] = "ui:click";
    UIEventType["DOWN"] = "ui:down";
    UIEventType["UP"] = "ui:up";
    UIEventType["PRESS"] = "ui:press";
    UIEventType["RELEASE"] = "ui:release";
    UIEventType["OVER"] = "ui:over";
    UIEventType["OUT"] = "ui:out";
    // Focus events
    UIEventType["FOCUS"] = "ui:focus";
    UIEventType["BLUR"] = "ui:blur";
    // Selection events
    UIEventType["SELECT"] = "ui:select";
    UIEventType["DESELECT"] = "ui:deselect";
    // Completion events
    UIEventType["COMPLETE"] = "ui:complete";
    UIEventType["SUBMIT"] = "ui:submit";
    // Group events
    UIEventType["SELECTION_CHANGE"] = "ui:selection_change";
    // Modal events
    UIEventType["OPEN"] = "ui:open";
    UIEventType["CLOSE"] = "ui:close";
    // Validation events
    UIEventType["VALID"] = "ui:valid";
    UIEventType["INVALID"] = "ui:invalid";
    // State events
    UIEventType["ENABLE"] = "ui:enable";
    UIEventType["DISABLE"] = "ui:disable";
    UIEventType["SHOW"] = "ui:show";
    UIEventType["HIDE"] = "ui:hide";
    // Animation events
    UIEventType["ANIMATION_START"] = "ui:animation_start";
    UIEventType["ANIMATION_END"] = "ui:animation_end";
})(UIEventType || (UIEventType = {}));
