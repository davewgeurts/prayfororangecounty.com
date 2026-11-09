/**
 * Canvas Dropdown Component
 */
import * as PIXI from "pixi.js";
import { BaseUIComponent } from "../base/BaseUIComponent";
import { UIEventBus } from "../base/UIEventBus";
import { UIEventType } from "../base/UIEventTypes";
export class CanvasDropdownObj extends BaseUIComponent {
    constructor(config) {
        // Set default dimensions
        if (!config.width)
            config.width = 200;
        if (!config.height)
            config.height = 40;
        super(config);
        this._selectedOptions = [];
        this._isOpen = false;
        this._searchText = '';
        // Graphics elements
        this._valueText = null;
        this._placeholderText = null;
        this._optionContainers = [];
        this._searchInput = null;
        // Animation
        this._dropdownHeight = 0;
        this._targetDropdownHeight = 0;
        this._chevronRotation = 0;
        this._targetChevronRotation = 0;
        this.HandlePointerDown = (event) => {
            if (!this._enabled)
                return;
            // Toggle dropdown
            if (this._isOpen) {
                this.close();
            }
            else {
                this.open();
            }
        };
        this._dropdownConfig = config;
        this._options = config.options || [];
        this._placeholder = config.placeholder || 'Select...';
        this._multiple = config.multiple || false;
        this._searchable = config.searchable || false;
        // Create dropdown elements
        this._chevron = new PIXI.Graphics();
        this._dropdown = new PIXI.Container();
        this._dropdownBg = new PIXI.Graphics();
        this._scrollContainer = new PIXI.Container();
        this._container.addChild(this._chevron);
        // Add dropdown to parent container (so it can overflow)
        this._dropdown.addChild(this._dropdownBg);
        this._dropdown.addChild(this._scrollContainer);
        this._dropdown.visible = false;
        // Now that all properties are initialized, call InitComponent and Render manually
        // (they were skipped during super() because properties weren't ready)
        console.log('%c CanvasDropdownObj: Calling InitComponent manually with options:', 'color: #00FF00', this._options);
        this.InitComponent();
        console.log('%c CanvasDropdownObj: After InitComponent, option containers:', 'color: #00FF00', this._optionContainers.length);
        this.Render();
        // Set initial value
        if (config.value !== undefined) {
            this.setValue(config.value);
        }
    }
    InitComponent() {
        // Safety check: if _placeholder hasn't been initialized yet (called during constructor), skip
        // This happens because super() in constructor calls InitComponent() before child properties are set
        if (!this._placeholder) {
            console.log('%c CanvasDropdownObj: InitComponent skipped (placeholder not ready)', 'color: #FF6600');
            return;
        }
        console.log('%c CanvasDropdownObj: InitComponent running', 'color: #00FFFF');
        // Create placeholder text
        this._placeholderText = new PIXI.Text({
            text: this._placeholder,
            style: {
                fontFamily: this._theme.fonts.family,
                fontSize: this._theme.fonts.size,
                fill: this._theme.colors.textDisabled,
                align: 'left'
            }
        });
        this._placeholderText.x = this._theme.spacing.small;
        this._placeholderText.y = (this.height - this._placeholderText.height) / 2;
        this._container.addChild(this._placeholderText);
        // Create value text
        this._valueText = new PIXI.Text({
            text: '',
            style: {
                fontFamily: this._theme.fonts.family,
                fontSize: this._theme.fonts.size,
                fill: this._theme.colors.text,
                align: 'left'
            }
        });
        this._valueText.x = this._theme.spacing.small;
        this._valueText.y = (this.height - this._valueText.height) / 2;
        this._valueText.visible = false;
        this._container.addChild(this._valueText);
        // Create search input if searchable
        if (this._searchable) {
            this._searchInput = new PIXI.Text({
                text: '',
                style: {
                    fontFamily: this._theme.fonts.family,
                    fontSize: this._theme.fonts.size,
                    fill: this._theme.colors.text,
                    align: 'left'
                }
            });
            this._searchInput.x = this._theme.spacing.small;
            this._searchInput.y = this._theme.spacing.small;
            this._scrollContainer.addChild(this._searchInput);
        }
        // Create option items
        this.createOptionItems();
        // Position dropdown below the main container
        this._dropdown.x = this.x;
        this._dropdown.y = this.y + this.height + 2;
        // Add dropdown to stage when needed
        if (this._container.parent) {
            this._container.parent.addChild(this._dropdown);
        }
        // Update initial display
        this.updateValueDisplay();
    }
    createOptionItems() {
        // Safety check: if _dropdownConfig hasn't been initialized yet (called during constructor), skip
        if (!this._dropdownConfig) {
            return;
        }
        // Initialize if not already initialized (safety check for initialization order issues)
        if (!this._optionContainers) {
            this._optionContainers = [];
        }
        // Clear existing options
        for (const container of this._optionContainers) {
            container.destroy();
        }
        this._optionContainers = [];
        let yPos = this._searchable ? 40 : 0;
        const filteredOptions = this.getFilteredOptions();
        for (let i = 0; i < filteredOptions.length; i++) {
            const option = filteredOptions[i];
            const optionContainer = new PIXI.Container();
            // Create background
            const bg = new PIXI.Graphics();
            optionContainer.addChild(bg);
            // Create text
            const text = new PIXI.Text({
                text: option.label,
                style: {
                    fontFamily: this._theme.fonts.family,
                    fontSize: this._theme.fonts.size,
                    fill: option.disabled ? this._theme.colors.textDisabled : this._theme.colors.text,
                    align: 'left'
                }
            });
            text.x = this._theme.spacing.small;
            text.y = (40 - text.height) / 2;
            optionContainer.addChild(text);
            // Create checkbox for multiple selection
            if (this._multiple) {
                const checkbox = new PIXI.Graphics();
                checkbox.x = this.width - 30;
                checkbox.y = 20;
                optionContainer.addChild(checkbox);
                // Store checkbox reference
                optionContainer.checkbox = checkbox;
            }
            // Set position
            optionContainer.y = yPos;
            yPos += 40;
            // Make interactive if not disabled
            if (!option.disabled) {
                optionContainer.eventMode = 'static';
                optionContainer.cursor = 'pointer';
                optionContainer.hitArea = new PIXI.Rectangle(0, 0, this.width, 40);
                // Store option reference
                optionContainer.option = option;
                optionContainer.bg = bg;
                optionContainer.text = text;
                // Add event listeners
                optionContainer.on('pointerover', () => this.handleOptionHover(optionContainer));
                optionContainer.on('pointerout', () => this.handleOptionOut(optionContainer));
                optionContainer.on('pointerdown', () => this.handleOptionClick(option));
            }
            this._scrollContainer.addChild(optionContainer);
            this._optionContainers.push(optionContainer);
        }
        // Update dropdown height
        this._targetDropdownHeight = Math.min(yPos + this._theme.spacing.small, this._dropdownConfig.maxHeight || 300);
    }
    getFilteredOptions() {
        // Safety check: if _options hasn't been initialized yet (called during constructor), return empty array
        if (!this._options) {
            return [];
        }
        if (!this._searchable || !this._searchText) {
            return this._options;
        }
        const searchLower = this._searchText.toLowerCase();
        return this._options.filter(option => option.label.toLowerCase().includes(searchLower));
    }
    handleOptionHover(container) {
        const bg = container.bg;
        if (bg) {
            bg.clear();
            bg.beginFill(this._theme.colors.surfaceHover);
            bg.drawRect(0, 0, this.width, 40);
            bg.endFill();
        }
    }
    handleOptionOut(container) {
        const bg = container.bg;
        const option = container.option;
        if (bg) {
            bg.clear();
            const isSelected = this._selectedOptions.includes(option);
            if (isSelected) {
                bg.beginFill(this._theme.colors.primaryLight, 0.2);
                bg.drawRect(0, 0, this.width, 40);
                bg.endFill();
            }
        }
    }
    handleOptionClick(option) {
        var _a, _b;
        if (this._multiple) {
            // Toggle selection
            const index = this._selectedOptions.indexOf(option);
            if (index >= 0) {
                this._selectedOptions.splice(index, 1);
            }
            else {
                this._selectedOptions.push(option);
            }
            // Update checkboxes
            this.updateCheckboxes();
            // Emit change event
            const values = this._selectedOptions.map(opt => opt.value);
            UIEventBus.emit(UIEventBus.createEvent(UIEventType.CHANGE, this, values, this._value));
            this._value = values;
            (_a = this._onChange) === null || _a === void 0 ? void 0 : _a.call(this, values, this);
        }
        else {
            // Single selection
            const previousValue = this._value;
            this._selectedOptions = [option];
            this._value = option.value;
            // Emit change event
            UIEventBus.emit(UIEventBus.createEvent(UIEventType.CHANGE, this, this._value, previousValue));
            (_b = this._onChange) === null || _b === void 0 ? void 0 : _b.call(this, this._value, this);
            // Close dropdown if configured
            if (this._dropdownConfig.closeOnSelect !== false) {
                this.close();
            }
        }
        // Update display
        this.updateValueDisplay();
        this.Render();
    }
    updateCheckboxes() {
        for (const container of this._optionContainers) {
            const checkbox = container.checkbox;
            const option = container.option;
            if (checkbox && option) {
                checkbox.clear();
                // Draw checkbox border
                checkbox.lineStyle(2, this._theme.colors.border);
                checkbox.drawRect(-8, -8, 16, 16);
                // Draw checkmark if selected
                if (this._selectedOptions.includes(option)) {
                    checkbox.lineStyle(2, this._theme.colors.primary);
                    checkbox.moveTo(-5, 0);
                    checkbox.lineTo(-2, 3);
                    checkbox.lineTo(5, -5);
                }
            }
        }
    }
    updateValueDisplay() {
        // Safety check: if _dropdownConfig hasn't been initialized yet, skip
        if (!this._dropdownConfig) {
            return;
        }
        if (this._selectedOptions.length === 0) {
            if (this._valueText)
                this._valueText.visible = false;
            if (this._placeholderText)
                this._placeholderText.visible = true;
        }
        else {
            if (this._placeholderText)
                this._placeholderText.visible = false;
            if (this._valueText) {
                this._valueText.visible = true;
                if (this._multiple) {
                    this._valueText.text = `${this._selectedOptions.length} selected`;
                }
                else if (this._dropdownConfig.renderValue) {
                    this._valueText.text = this._dropdownConfig.renderValue(this._value);
                }
                else {
                    this._valueText.text = this._selectedOptions[0].label;
                }
            }
        }
    }
    Render() {
        // Safety check: if _chevron hasn't been initialized yet (called during constructor), skip
        if (!this._chevron) {
            return;
        }
        this._graphics.clear();
        // Get colors based on state
        const bgColor = this._isOpen ?
            this._theme.colors.surfaceHover :
            this._theme.colors.surface;
        const borderColor = !this._isValid ? this._theme.colors.error :
            this._isOpen ? this._theme.colors.primary :
                this._hovered ? this._theme.colors.borderHover :
                    this._theme.colors.border;
        // Draw main container background
        this._graphics.beginFill(bgColor);
        this._graphics.lineStyle(2, borderColor);
        this._graphics.drawRoundedRect(0, 0, this.width, this.height, this._theme.borderRadius);
        this._graphics.endFill();
        // Draw chevron
        this._chevron.clear();
        this._chevron.lineStyle(2, this._theme.colors.text);
        this._chevron.rotation = this._chevronRotation;
        this._chevron.x = this.width - 20;
        this._chevron.y = this.height / 2;
        this._chevron.moveTo(-4, -2);
        this._chevron.lineTo(0, 2);
        this._chevron.lineTo(4, -2);
        // Draw dropdown background
        if (this._isOpen) {
            this._dropdownBg.clear();
            this._dropdownBg.beginFill(this._theme.colors.surface);
            this._dropdownBg.lineStyle(2, this._theme.colors.border);
            this._dropdownBg.drawRoundedRect(0, 0, this.width, this._dropdownHeight, this._theme.borderRadius);
            this._dropdownBg.endFill();
            // Add shadow
            const shadow = new PIXI.Graphics();
            shadow.beginFill(0x000000, 0.1);
            shadow.drawRoundedRect(2, 2, this.width, this._dropdownHeight, this._theme.borderRadius);
            shadow.endFill();
            this._dropdownBg.addChildAt(shadow, 0);
        }
        // Update option backgrounds
        for (const container of this._optionContainers) {
            const bg = container.bg;
            const option = container.option;
            if (bg && option) {
                const isSelected = this._selectedOptions.includes(option);
                if (isSelected) {
                    bg.clear();
                    bg.beginFill(this._theme.colors.primaryLight, 0.2);
                    bg.drawRect(0, 0, this.width, 40);
                    bg.endFill();
                }
            }
        }
        // Set container alpha for disabled state
        this._container.alpha = this._enabled ? 1.0 : 0.5;
    }
    UpdateAnimation(progress) {
        // Easing function
        const eased = 1 - Math.pow(1 - progress, 3);
        // Update dropdown height
        const heightDiff = this._targetDropdownHeight - this._dropdownHeight;
        this._dropdownHeight += heightDiff * eased;
        // Update chevron rotation
        const rotationDiff = this._targetChevronRotation - this._chevronRotation;
        this._chevronRotation += rotationDiff * eased;
        // Update dropdown visibility
        this._dropdown.visible = this._dropdownHeight > 1;
        // Apply mask for smooth open/close
        if (this._dropdown.visible) {
            const mask = new PIXI.Graphics();
            mask.beginFill(0xFFFFFF);
            mask.drawRect(0, 0, this.width, this._dropdownHeight);
            mask.endFill();
            this._scrollContainer.mask = mask;
        }
        this.Render();
    }
    /**
     * Open dropdown
     */
    open() {
        if (this._isOpen)
            return;
        this._isOpen = true;
        this._targetDropdownHeight = Math.min(this._optionContainers.length * 40 + (this._searchable ? 40 : 0) + this._theme.spacing.small, this._dropdownConfig.maxHeight || 300);
        this._targetChevronRotation = Math.PI;
        // Position dropdown
        this._dropdown.x = this._container.x;
        this._dropdown.y = this._container.y + this.height + 2;
        this.StartAnimation();
        UIEventBus.emit(UIEventBus.createEvent(UIEventType.OPEN, this));
    }
    /**
     * Close dropdown
     */
    close() {
        if (!this._isOpen)
            return;
        this._isOpen = false;
        this._targetDropdownHeight = 0;
        this._targetChevronRotation = 0;
        // Clear search
        this._searchText = '';
        if (this._searchInput) {
            this._searchInput.text = '';
        }
        this.StartAnimation();
        UIEventBus.emit(UIEventBus.createEvent(UIEventType.CLOSE, this));
    }
    /**
     * Toggle dropdown
     */
    toggle() {
        if (this._isOpen) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Set value
     */
    setValue(value) {
        if (this._multiple && Array.isArray(value)) {
            this._selectedOptions = this._options.filter(opt => value.includes(opt.value));
            this._value = value;
        }
        else {
            const option = this._options.find(opt => opt.value === value);
            if (option) {
                this._selectedOptions = [option];
                this._value = value;
            }
            else {
                this._selectedOptions = [];
                this._value = null;
            }
        }
        this.updateValueDisplay();
        this.updateCheckboxes();
        this.Render();
    }
    /**
     * Clear selection
     */
    clear() {
        this._selectedOptions = [];
        this._value = this._multiple ? [] : null;
        this.updateValueDisplay();
        this.updateCheckboxes();
        this.Render();
    }
    /**
     * Add option
     */
    addOption(option) {
        this._options.push(option);
        this.createOptionItems();
        this.Render();
    }
    /**
     * Remove option
     */
    removeOption(value) {
        const index = this._options.findIndex(opt => opt.value === value);
        if (index >= 0) {
            this._options.splice(index, 1);
            // Remove from selection if selected
            const selectedIndex = this._selectedOptions.findIndex(opt => opt.value === value);
            if (selectedIndex >= 0) {
                this._selectedOptions.splice(selectedIndex, 1);
                this.updateValueDisplay();
            }
            this.createOptionItems();
            this.Render();
        }
    }
    /**
     * Set options
     */
    setOptions(options) {
        this._options = options;
        this._selectedOptions = [];
        this._value = this._multiple ? [] : null;
        this.createOptionItems();
        this.updateValueDisplay();
        this.Render();
    }
    /**
     * Get selected option(s)
     */
    getSelected() {
        if (this._multiple) {
            return this._selectedOptions;
        }
        return this._selectedOptions[0] || null;
    }
    /**
     * Dispose
     */
    Dispose() {
        // Remove dropdown from parent
        if (this._dropdown.parent) {
            this._dropdown.parent.removeChild(this._dropdown);
        }
        // Destroy option containers
        for (const container of this._optionContainers) {
            container.destroy();
        }
        // Destroy dropdown
        this._dropdown.destroy();
        super.Dispose();
    }
}
