import { RiveAnimationObject } from "./RiveAnimationObj";
import RivePakUtils from "../RivePakUtils";
import { RIVE_COMMON_ENUMS, RIVE_CURSOR_TYPES } from "./CanvasRiveObj";
export var RIVE_BUTTON_STATES;
(function (RIVE_BUTTON_STATES) {
    RIVE_BUTTON_STATES["UP"] = "UP";
    RIVE_BUTTON_STATES["OVER"] = "OVER";
    RIVE_BUTTON_STATES["OUT"] = "OUT";
    RIVE_BUTTON_STATES["UNSELECTED"] = "UNSELECTED";
    RIVE_BUTTON_STATES["SELECTED"] = "SELECTED";
    RIVE_BUTTON_STATES["DISABLED"] = "DISABLED";
    RIVE_BUTTON_STATES["DISABLED_OVER"] = "DISABLED_OVER";
    RIVE_BUTTON_STATES["DISABLED_OVER_OUT"] = "DISABLED_OVER_OUT";
})(RIVE_BUTTON_STATES || (RIVE_BUTTON_STATES = {}));
export var RIVE_BUTTON_MODES;
(function (RIVE_BUTTON_MODES) {
    RIVE_BUTTON_MODES["DISABLED"] = "DISABLED";
    RIVE_BUTTON_MODES["BUTTON"] = "BUTTON";
    RIVE_BUTTON_MODES["TOGGLE"] = "TOGGLE";
})(RIVE_BUTTON_MODES || (RIVE_BUTTON_MODES = {}));
export class RiveButtonObject extends RiveAnimationObject {
    get RiveButtonMode() { return this._buttonMode; }
    constructor(riveDef, artboard) {
        super(riveDef, artboard);
        this._debugButton = false;
        this._buttonMode = RIVE_BUTTON_MODES.DISABLED;
        this._buttonInitialized = false;
        this._riveButtonEnabled = true;
        this._riveButtonHidden = false;
    }
    Update(time, frameCount, onceSecond, onceMinute) {
        if (this.enabled === false)
            return;
        super.Update(time, frameCount, onceSecond, onceMinute);
    }
    InitRiveObject() {
        super.InitRiveObject();
        if (!this._buttonInitialized) {
            this.CurrentCursor = RIVE_CURSOR_TYPES.DEFAULT;
        }
    }
    InitRiveButton(buttonMode = RIVE_BUTTON_MODES.DISABLED, colorsObj) {
        if (this._debugButton)
            console.log(' InitRiveButton(' + buttonMode + ') ', colorsObj);
        this._buttonInitialized = true;
        if (colorsObj === undefined) {
            //DEFAULT QA COLORS
            colorsObj = {
                BACKDROP_COLOR: RivePakUtils.HexToArgb('#f42020'),
                BACKDROP_BORDER_COLOR: RivePakUtils.HexToArgb('#000000'),
                BACKDROP_BORDER_HOVER_COLOR: RivePakUtils.HexToArgb('#4d0083'),
                BACKDROP_HOVER_COLOR: RivePakUtils.HexToArgb('#1fd11c'),
                BACKDROP_SELECTED_COLOR: RivePakUtils.HexToArgb('#ffffff'),
                BACKDROP_DISABLED_COLOR: RivePakUtils.HexToArgb('#000000'),
                BUTTON_CLICK_FX_COLOR: RivePakUtils.HexToArgb('#f6ff00')
            };
        }
        this.CurrentCursor = (buttonMode === RIVE_BUTTON_MODES.DISABLED) ? RIVE_CURSOR_TYPES.NOT_ALLOWED : RIVE_CURSOR_TYPES.POINTER;
        this._buttonMode = buttonMode;
        if (colorsObj && this.ViewModelInstance) {
            for (const [key, value] of Object.entries(colorsObj)) {
                if (value !== undefined) {
                    const [a, r, g, b] = value;
                    const colorInput = this.ViewModelInstance.color(`${this.baseRiveVMPath}${key}`);
                    if (colorInput) {
                        colorInput.argb(a, r, g, b);
                    }
                }
            }
        }
    }
    DisableButton() {
        if (!this._buttonInitialized)
            return;
        if (this._riveButtonEnabled) {
            this.CurrentCursor = RIVE_CURSOR_TYPES.NOT_ALLOWED;
            this._riveButtonEnabled = false;
            this.QueueViewModelEnumChange(RIVE_COMMON_ENUMS.BUTTON_STATE, RIVE_BUTTON_STATES.UP);
            this.QueueViewModelEnumChange(RIVE_COMMON_ENUMS.BUTTON_STATE, RIVE_BUTTON_STATES.DISABLED);
        }
    }
    get RiveButtonHidden() { return this._riveButtonHidden; }
    // Fully hide the button: collapse the visuals (IS_HIDDEN), kill the hit area so it can't be
    // hovered/clicked, and drop the cursor back to default. Idempotent. Pair with ShowButton().
    HideButton() {
        var _a;
        if (!this._buttonInitialized)
            return;
        if (this._riveButtonHidden)
            return;
        this._riveButtonHidden = true;
        const hidden = (_a = this.ViewModelInstance) === null || _a === void 0 ? void 0 : _a.boolean(`${this.baseRiveVMPath}${RiveButtonObject.IS_HIDDEN_PROP}`);
        if (hidden)
            hidden.value = true;
        this.SetHitTestEnabled(false);
        this.CurrentCursor = RIVE_CURSOR_TYPES.DEFAULT;
    }
    // Reverse HideButton(): reveal the visuals, re-arm the hit area, and restore the cursor the
    // button's current mode dictates (NOT_ALLOWED while disabled, POINTER otherwise). Idempotent.
    ShowButton() {
        var _a;
        if (!this._buttonInitialized)
            return;
        if (!this._riveButtonHidden)
            return;
        this._riveButtonHidden = false;
        const hidden = (_a = this.ViewModelInstance) === null || _a === void 0 ? void 0 : _a.boolean(`${this.baseRiveVMPath}${RiveButtonObject.IS_HIDDEN_PROP}`);
        if (hidden)
            hidden.value = false;
        this.SetHitTestEnabled(true);
        this.CurrentCursor = this._riveButtonEnabled ? RIVE_CURSOR_TYPES.POINTER : RIVE_CURSOR_TYPES.NOT_ALLOWED;
    }
    EnableButton() {
        if (!this._buttonInitialized)
            return;
        this.CurrentCursor = RIVE_CURSOR_TYPES.POINTER;
        if (!this._riveButtonEnabled) {
            this._riveButtonEnabled = true;
            this.QueueViewModelEnumChange(RIVE_COMMON_ENUMS.BUTTON_STATE, RIVE_BUTTON_STATES.DISABLED);
            this.QueueViewModelEnumChange(RIVE_COMMON_ENUMS.BUTTON_STATE, RIVE_BUTTON_STATES.UP);
        }
    }
    setButtonState(state) {
        if (this._debugButton)
            console.log(' setButtonState(' + this._buttonMode + '):', state);
        this.ViewModelInstance.enum(`${this.baseRiveVMPath}${RIVE_COMMON_ENUMS.BUTTON_STATE}`).value = state;
    }
    onClick(event) {
        if (!this._buttonInitialized || this._riveButtonHidden)
            return;
        if (this._debugButton)
            console.log('%c onClick(' + this._buttonMode + ') - this._buttonMode:' + this._buttonMode + ',  this.baseRiveVMPath:' + this.baseRiveVMPath, 'color: blue;');
        if (this.ViewModelInstance && this._riveButtonEnabled) {
            if (this._buttonMode === RIVE_BUTTON_MODES.BUTTON) {
                if (this._debugButton)
                    console.log('%c onClick(' + this._buttonMode + ') - BUTTON CLICK!', 'color: red;');
                this.InputByName("BUTTON_CLICK_EVENT").asTrigger().fire();
            }
            else if (this._buttonMode === RIVE_BUTTON_MODES.TOGGLE) {
                if (this.ViewModelInstance.enum(`${this.baseRiveVMPath}${RIVE_COMMON_ENUMS.BUTTON_STATE}`).value === RIVE_BUTTON_STATES.SELECTED) {
                    if (this._debugButton)
                        console.log('%c onClick(' + this._buttonMode + ') - UnSelect!', 'color: red;');
                    this.setButtonState(RIVE_BUTTON_STATES.UNSELECTED);
                }
                else {
                    if (this._debugButton)
                        console.log('%c onClick(' + this._buttonMode + ') - SELECT!', 'color: red;');
                    this.setButtonState(RIVE_BUTTON_STATES.SELECTED);
                }
            }
        }
        super.onClick(event);
    }
    onHover() {
        if (!this._buttonInitialized || this._riveButtonHidden)
            return;
        if (this.ViewModelInstance.enum(`${this.baseRiveVMPath}${RIVE_COMMON_ENUMS.BUTTON_STATE}`).value !== RIVE_BUTTON_STATES.SELECTED) {
            if (this._riveButtonEnabled) {
                if (this._debugButton)
                    console.log('%c onHover(' + this._buttonMode + ') - Pod Type OVER', 'color: green;');
                this.setButtonState(RIVE_BUTTON_STATES.OVER);
            }
            else {
                if (this._debugButton)
                    console.log('%c onHover(' + this._buttonMode + ') - Pod Type DISABLED OVER', 'color: green;');
                this.setButtonState(RIVE_BUTTON_STATES.DISABLED_OVER);
            }
        }
        super.onHover();
    }
    onHoverOut() {
        if (!this._buttonInitialized || this._riveButtonHidden)
            return;
        if (this.ViewModelInstance.enum(`${this.baseRiveVMPath}${RIVE_COMMON_ENUMS.BUTTON_STATE}`).value === RIVE_BUTTON_STATES.SELECTED) {
            this.setButtonState(RIVE_BUTTON_STATES.SELECTED);
        }
        else {
            if (this._riveButtonEnabled) {
                if (this._debugButton)
                    console.log('%c onHoverOut(' + this._buttonMode + ') - Pod Type OUT', 'color: green;');
                this.setButtonState(RIVE_BUTTON_STATES.OUT);
            }
            else {
                if (this._debugButton)
                    console.log('%c onHoverOut(' + this._buttonMode + ') - Pod Type DISABLED', 'color: green;');
                this.setButtonState(RIVE_BUTTON_STATES.DISABLED);
            }
        }
        super.onHoverOut();
    }
    Dispose() {
        super.Dispose();
    }
}
// Boolean on the button VM that the Rive button component's converter reacts to (collapse/fade).
// Setting it is enough for the visuals; interactivity + cursor are handled separately below.
RiveButtonObject.IS_HIDDEN_PROP = "IS_HIDDEN";
