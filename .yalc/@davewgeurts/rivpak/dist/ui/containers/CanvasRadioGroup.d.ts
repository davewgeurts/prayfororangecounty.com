/**
 * Canvas Radio Group - Manages exclusive selection of radio buttons
 */
import { CanvasFlexContainer, FlexContainerConfig } from "./CanvasFlexContainer";
import { CanvasRadioObj, RadioConfig } from "../components/CanvasRadioObj";
import { ChangeCallback } from "../base/UIEventTypes";
export interface RadioGroupConfig extends FlexContainerConfig {
    options: RadioConfig[];
    selectedIndex?: number;
    selectedValue?: any;
    groupName?: string;
    onSelectionChange?: ChangeCallback<any>;
}
export declare class CanvasRadioGroup extends CanvasFlexContainer {
    private _groupConfig;
    private _radios;
    private _selectedIndex;
    private _groupName;
    constructor(config: RadioGroupConfig);
    private createRadios;
    private handleRadioSelect;
    /**
     * Get selected radio
     */
    getSelectedRadio(): CanvasRadioObj | null;
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
     * Enable/disable specific radio
     */
    setRadioEnabled(index: number, enabled: boolean): void;
    /**
     * Enable/disable all radios
     */
    setAllRadiosEnabled(enabled: boolean): void;
    /**
     * Add a new radio option
     */
    addOption(config: RadioConfig): void;
    /**
     * Remove a radio option
     */
    removeOption(index: number): void;
    /**
     * Clear all options
     */
    clearOptions(): void;
    /**
     * Validate (required groups must have selection)
     */
    validate(): boolean;
}
