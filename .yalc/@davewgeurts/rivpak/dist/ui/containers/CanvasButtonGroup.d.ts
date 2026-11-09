/**
 * Canvas Button Group - Group of buttons with exclusive selection option
 */
import { CanvasFlexContainer, FlexContainerConfig } from "./CanvasFlexContainer";
import { CanvasButtonObj, ButtonConfig } from "../components/CanvasButtonObj";
import { ChangeCallback } from "../base/UIEventTypes";
export interface ButtonGroupConfig extends FlexContainerConfig {
    buttons: ButtonConfig[];
    exclusive?: boolean;
    allowDeselect?: boolean;
    selectedIndex?: number;
    selectedValue?: any;
    onSelectionChange?: ChangeCallback<any>;
}
export declare class CanvasButtonGroup extends CanvasFlexContainer {
    private _groupConfig;
    private _buttons;
    private _exclusive;
    private _allowDeselect;
    private _selectedIndex;
    constructor(config: ButtonGroupConfig);
    private createButtons;
    private handleButtonClick;
    /**
     * Get selected button
     */
    getSelectedButton(): CanvasButtonObj | null;
    /**
     * Get selected index
     */
    getSelectedIndex(): number;
    /**
     * Set selected index
     */
    setSelectedIndex(index: number): void;
    /**
     * Get selected value
     */
    getValue(): any;
    /**
     * Set selected value
     */
    setSelectedValue(value: any): void;
    /**
     * Get all selected values (for non-exclusive groups)
     */
    getSelectedValues(): any[];
    /**
     * Enable/disable specific button
     */
    setButtonEnabled(index: number, enabled: boolean): void;
    /**
     * Enable/disable all buttons
     */
    setAllButtonsEnabled(enabled: boolean): void;
    /**
     * Add a new button
     */
    addButton(config: ButtonConfig): void;
    /**
     * Remove a button
     */
    removeButton(index: number): void;
    /**
     * Clear all buttons
     */
    clearButtons(): void;
    /**
     * Validate (for required groups)
     */
    validate(): boolean;
}
