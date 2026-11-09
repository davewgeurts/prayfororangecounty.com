/**
 * Canvas Checkbox Group - Manages multiple checkboxes
 */
import { CanvasFlexContainer } from "./CanvasFlexContainer";
import { CanvasCheckboxObj } from "../components/CanvasCheckboxObj";
import { UIEventBus } from "../base/UIEventBus";
import { UIEventType } from "../base/UIEventTypes";
export class CanvasCheckboxGroup extends CanvasFlexContainer {
    constructor(config) {
        // Set default layout for checkbox group (vertical by default)
        config.direction = config.direction || 'column';
        config.gap = config.gap !== undefined ? config.gap : 8;
        config.align = config.align || 'start';
        super(config);
        this._checkboxes = [];
        this._selectAllCheckbox = null;
        this._groupConfig = config;
        this._minSelected = config.minSelected || 0;
        this._maxSelected = config.maxSelected || Infinity;
        // Create checkboxes
        this.createCheckboxes();
        // Set initial selection
        if (config.selectedValues) {
            this.setSelectedValues(config.selectedValues);
        }
    }
    createCheckboxes() {
        // Create "Select All" checkbox if enabled
        if (this._groupConfig.allowSelectAll) {
            const selectAllConfig = {
                label: 'Select All',
                checked: false,
                onChange: (checked) => {
                    if (checked) {
                        this.selectAll();
                    }
                    else {
                        this.deselectAll();
                    }
                }
            };
            this._selectAllCheckbox = new CanvasCheckboxObj(selectAllConfig);
            this.addChildren(this._selectAllCheckbox);
            // Add separator
            // Could add a visual separator here if desired
        }
        // Create option checkboxes
        for (let i = 0; i < this._groupConfig.options.length; i++) {
            const checkboxConfig = this._groupConfig.options[i];
            // Create checkbox with change handler
            const originalOnChange = checkboxConfig.onChange;
            checkboxConfig.onChange = (checked, checkbox) => {
                this.handleCheckboxChange(i, checkbox, checked);
                originalOnChange === null || originalOnChange === void 0 ? void 0 : originalOnChange(checked, checkbox);
            };
            // Create checkbox
            const checkbox = new CanvasCheckboxObj(checkboxConfig);
            this._checkboxes.push(checkbox);
            // Add to container
            this.addChildren(checkbox);
        }
    }
    handleCheckboxChange(index, checkbox, checked) {
        var _a, _b;
        // Get current selection count
        const selectedCount = this.getSelectedCheckboxes().length;
        // Check constraints
        if (checked && selectedCount > this._maxSelected) {
            // Uncheck the checkbox if max is exceeded
            checkbox.setChecked(false);
            return;
        }
        if (!checked && selectedCount < this._minSelected) {
            // Re-check the checkbox if min is not met
            checkbox.setChecked(true);
            return;
        }
        // Update select all checkbox
        this.updateSelectAllState();
        // Emit selection change event
        const selectedValues = this.getSelectedValues();
        UIEventBus.emit(UIEventBus.createEvent(UIEventType.SELECTION_CHANGE, this, selectedValues, null));
        (_b = (_a = this._groupConfig).onSelectionChange) === null || _b === void 0 ? void 0 : _b.call(_a, selectedValues, this);
    }
    updateSelectAllState() {
        if (!this._selectAllCheckbox)
            return;
        const totalCount = this._checkboxes.length;
        const selectedCount = this.getSelectedCheckboxes().length;
        if (selectedCount === 0) {
            this._selectAllCheckbox.setChecked(false);
            this._selectAllCheckbox.setIndeterminate(false);
        }
        else if (selectedCount === totalCount) {
            this._selectAllCheckbox.setChecked(true);
            this._selectAllCheckbox.setIndeterminate(false);
        }
        else {
            this._selectAllCheckbox.setIndeterminate(true);
        }
    }
    /**
     * Get selected checkboxes
     */
    getSelectedCheckboxes() {
        return this._checkboxes.filter(cb => cb.getChecked());
    }
    /**
     * Get selected values
     */
    getSelectedValues() {
        return this.getSelectedCheckboxes().map(cb => cb.getValue());
    }
    /**
     * Get values array
     */
    getValue() {
        return this.getSelectedValues();
    }
    /**
     * Set selected values
     */
    setSelectedValues(values) {
        var _a, _b;
        for (const checkbox of this._checkboxes) {
            const value = checkbox.getValue();
            checkbox.setChecked(values.includes(value));
        }
        this.updateSelectAllState();
        // Emit event
        UIEventBus.emit(UIEventBus.createEvent(UIEventType.SELECTION_CHANGE, this, values, null));
        (_b = (_a = this._groupConfig).onSelectionChange) === null || _b === void 0 ? void 0 : _b.call(_a, values, this);
    }
    /**
     * Select all checkboxes
     */
    selectAll() {
        var _a, _b;
        for (const checkbox of this._checkboxes) {
            checkbox.setChecked(true);
        }
        this.updateSelectAllState();
        const selectedValues = this.getSelectedValues();
        UIEventBus.emit(UIEventBus.createEvent(UIEventType.SELECTION_CHANGE, this, selectedValues, null));
        (_b = (_a = this._groupConfig).onSelectionChange) === null || _b === void 0 ? void 0 : _b.call(_a, selectedValues, this);
    }
    /**
     * Deselect all checkboxes
     */
    deselectAll() {
        var _a, _b;
        // Check if we can deselect all based on minSelected
        if (this._minSelected > 0)
            return;
        for (const checkbox of this._checkboxes) {
            checkbox.setChecked(false);
        }
        this.updateSelectAllState();
        const selectedValues = this.getSelectedValues();
        UIEventBus.emit(UIEventBus.createEvent(UIEventType.SELECTION_CHANGE, this, selectedValues, null));
        (_b = (_a = this._groupConfig).onSelectionChange) === null || _b === void 0 ? void 0 : _b.call(_a, selectedValues, this);
    }
    /**
     * Toggle checkbox at index
     */
    toggleCheckbox(index) {
        if (index >= 0 && index < this._checkboxes.length) {
            this._checkboxes[index].toggle();
        }
    }
    /**
     * Enable/disable specific checkbox
     */
    setCheckboxEnabled(index, enabled) {
        if (index >= 0 && index < this._checkboxes.length) {
            this._checkboxes[index].setEnabled(enabled);
        }
    }
    /**
     * Enable/disable all checkboxes
     */
    setAllCheckboxesEnabled(enabled) {
        for (const checkbox of this._checkboxes) {
            checkbox.setEnabled(enabled);
        }
        if (this._selectAllCheckbox) {
            this._selectAllCheckbox.setEnabled(enabled);
        }
    }
    /**
     * Add a new checkbox option
     */
    addOption(config) {
        // Create checkbox with change handler
        const index = this._checkboxes.length;
        const originalOnChange = config.onChange;
        config.onChange = (checked, checkbox) => {
            this.handleCheckboxChange(index, checkbox, checked);
            originalOnChange === null || originalOnChange === void 0 ? void 0 : originalOnChange(checked, checkbox);
        };
        // Create and add checkbox
        const checkbox = new CanvasCheckboxObj(config);
        this._checkboxes.push(checkbox);
        this.addChildren(checkbox);
        this.updateSelectAllState();
    }
    /**
     * Remove a checkbox option
     */
    removeOption(index) {
        if (index >= 0 && index < this._checkboxes.length) {
            const checkbox = this._checkboxes[index];
            this._checkboxes.splice(index, 1);
            this.removeChild(checkbox);
            checkbox.Dispose();
            this.updateSelectAllState();
        }
    }
    /**
     * Clear all options
     */
    clearOptions() {
        for (const checkbox of this._checkboxes) {
            this.removeChild(checkbox);
            checkbox.Dispose();
        }
        this._checkboxes = [];
        // Keep select all checkbox if it exists
        if (this._selectAllCheckbox) {
            this._selectAllCheckbox.setChecked(false);
            this._selectAllCheckbox.setIndeterminate(false);
        }
    }
    /**
     * Validate (check min/max constraints)
     */
    validate() {
        const selectedCount = this.getSelectedCheckboxes().length;
        if (selectedCount < this._minSelected) {
            this._isValid = false;
            this._validationMessage = `Please select at least ${this._minSelected} option(s)`;
        }
        else if (selectedCount > this._maxSelected) {
            this._isValid = false;
            this._validationMessage = `Please select at most ${this._maxSelected} option(s)`;
        }
        else {
            this._isValid = true;
            this._validationMessage = '';
        }
        UIEventBus.emit(UIEventBus.createEvent(this._isValid ? UIEventType.VALID : UIEventType.INVALID, this, this._isValid, !this._isValid, { message: this._validationMessage }));
        return this._isValid;
    }
    /**
     * Get checkbox at index
     */
    getCheckbox(index) {
        return this._checkboxes[index] || null;
    }
    /**
     * Get all checkboxes
     */
    getCheckboxes() {
        return [...this._checkboxes];
    }
}
