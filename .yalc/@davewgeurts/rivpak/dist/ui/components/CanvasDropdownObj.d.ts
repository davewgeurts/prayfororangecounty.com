/**
 * Canvas Dropdown Component
 */
import * as PIXI from "pixi.js";
import { BaseUIComponent, UIComponentConfig } from "../base/BaseUIComponent";
export interface DropdownOption {
    value: any;
    label: string;
    disabled?: boolean;
    icon?: string;
    group?: string;
}
export interface DropdownConfig extends UIComponentConfig {
    options: DropdownOption[];
    placeholder?: string;
    value?: any;
    multiple?: boolean;
    searchable?: boolean;
    clearable?: boolean;
    maxHeight?: number;
    renderOption?: (option: DropdownOption) => string;
    renderValue?: (value: any) => string;
    groupBy?: string;
    closeOnSelect?: boolean;
}
export declare class CanvasDropdownObj extends BaseUIComponent {
    private _dropdownConfig;
    private _options;
    private _selectedOptions;
    private _isOpen;
    private _placeholder;
    private _multiple;
    private _searchable;
    private _searchText;
    private _valueText;
    private _placeholderText;
    private _chevron;
    private _dropdown;
    private _dropdownBg;
    private _optionContainers;
    private _scrollContainer;
    private _searchInput;
    private _dropdownHeight;
    private _targetDropdownHeight;
    private _chevronRotation;
    private _targetChevronRotation;
    constructor(config: DropdownConfig);
    protected InitComponent(): void;
    private createOptionItems;
    private getFilteredOptions;
    private handleOptionHover;
    private handleOptionOut;
    private handleOptionClick;
    private updateCheckboxes;
    private updateValueDisplay;
    protected Render(): void;
    protected HandlePointerDown: (event: PIXI.FederatedPointerEvent) => void;
    protected UpdateAnimation(progress: number): void;
    /**
     * Open dropdown
     */
    open(): void;
    /**
     * Close dropdown
     */
    close(): void;
    /**
     * Toggle dropdown
     */
    toggle(): void;
    /**
     * Set value
     */
    setValue(value: any): void;
    /**
     * Clear selection
     */
    clear(): void;
    /**
     * Add option
     */
    addOption(option: DropdownOption): void;
    /**
     * Remove option
     */
    removeOption(value: any): void;
    /**
     * Set options
     */
    setOptions(options: DropdownOption[]): void;
    /**
     * Get selected option(s)
     */
    getSelected(): DropdownOption | DropdownOption[] | null;
    /**
     * Dispose
     */
    Dispose(): void;
}
