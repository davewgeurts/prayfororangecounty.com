/**
 * Canvas Checkbox Group - Manages multiple checkboxes
 */
import { CanvasFlexContainer, FlexContainerConfig } from "./CanvasFlexContainer";
import { CanvasCheckboxObj, CheckboxConfig } from "../components/CanvasCheckboxObj";
import { ChangeCallback } from "../base/UIEventTypes";
export interface CheckboxGroupConfig extends FlexContainerConfig {
    options: CheckboxConfig[];
    selectedValues?: any[];
    minSelected?: number;
    maxSelected?: number;
    allowSelectAll?: boolean;
    onSelectionChange?: ChangeCallback<any[]>;
}
export declare class CanvasCheckboxGroup extends CanvasFlexContainer {
    private _groupConfig;
    private _checkboxes;
    private _minSelected;
    private _maxSelected;
    private _selectAllCheckbox;
    constructor(config: CheckboxGroupConfig);
    private createCheckboxes;
    private handleCheckboxChange;
    private updateSelectAllState;
    /**
     * Get selected checkboxes
     */
    getSelectedCheckboxes(): CanvasCheckboxObj[];
    /**
     * Get selected values
     */
    getSelectedValues(): any[];
    /**
     * Get values array
     */
    getValue(): any[];
    /**
     * Set selected values
     */
    setSelectedValues(values: any[]): void;
    /**
     * Select all checkboxes
     */
    selectAll(): void;
    /**
     * Deselect all checkboxes
     */
    deselectAll(): void;
    /**
     * Toggle checkbox at index
     */
    toggleCheckbox(index: number): void;
    /**
     * Enable/disable specific checkbox
     */
    setCheckboxEnabled(index: number, enabled: boolean): void;
    /**
     * Enable/disable all checkboxes
     */
    setAllCheckboxesEnabled(enabled: boolean): void;
    /**
     * Add a new checkbox option
     */
    addOption(config: CheckboxConfig): void;
    /**
     * Remove a checkbox option
     */
    removeOption(index: number): void;
    /**
     * Clear all options
     */
    clearOptions(): void;
    /**
     * Validate (check min/max constraints)
     */
    validate(): boolean;
    /**
     * Get checkbox at index
     */
    getCheckbox(index: number): CanvasCheckboxObj | null;
    /**
     * Get all checkboxes
     */
    getCheckboxes(): CanvasCheckboxObj[];
}
