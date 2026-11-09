/**
 * Canvas Modal Component
 */
import { BaseUIComponent, UIComponentConfig } from "../base/BaseUIComponent";
import { CanvasButtonObj, ButtonConfig } from "./CanvasButtonObj";
export interface ModalConfig extends UIComponentConfig {
    title?: string;
    content: string | BaseUIComponent | BaseUIComponent[];
    showCloseButton?: boolean;
    showOverlay?: boolean;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    buttons?: ButtonConfig[];
    modalWidth?: number;
    modalHeight?: number;
    centered?: boolean;
    animateIn?: boolean;
    animateOut?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
}
export declare class CanvasModalObj extends BaseUIComponent {
    private _modalConfig;
    private _isOpen;
    private _overlay;
    private _modalContainer;
    private _modalBg;
    private _titleBar;
    private _titleText;
    private _closeButton;
    private _contentContainer;
    private _buttonContainer;
    private _buttons;
    private _overlayAlpha;
    private _targetOverlayAlpha;
    private _modalScale;
    private _targetModalScale;
    private _modalAlpha;
    private _targetModalAlpha;
    constructor(config: ModalConfig);
    protected InitComponent(): void;
    private centerModal;
    protected Render(): void;
    private handleOverlayClick;
    private handleCloseClick;
    private handleKeyDown;
    protected UpdateAnimation(progress: number): void;
    /**
     * Open modal
     */
    open(): void;
    /**
     * Close modal
     */
    close(): void;
    /**
     * Toggle modal
     */
    toggle(): void;
    /**
     * Confirm and close
     */
    confirm(): void;
    /**
     * Cancel and close
     */
    cancel(): void;
    /**
     * Set title
     */
    setTitle(title: string): void;
    /**
     * Set content
     */
    setContent(content: string | BaseUIComponent | BaseUIComponent[]): void;
    /**
     * Get button by index
     */
    getButton(index: number): CanvasButtonObj | null;
    /**
     * Dispose
     */
    Dispose(): void;
}
