/**
 * Canvas Flex Container - Layout container for UI components
 */
import { BaseUIComponent } from "../base/BaseUIComponent";
export class CanvasFlexContainer extends BaseUIComponent {
    constructor(config) {
        super(config);
        this._children = []; // Initialize after super
        this._flexConfig = config;
        this._direction = config.direction || 'row';
        this._justify = config.justify || 'start';
        this._align = config.align || 'center';
        this._gap = config.gap || this._theme.spacing.small;
        this._wrap = config.wrap || false;
        this._autoSize = config.autoSize !== false;
        // Parse padding
        if (Array.isArray(config.containerPadding)) {
            if (config.containerPadding.length === 2) {
                this._padding = {
                    top: config.containerPadding[0],
                    right: config.containerPadding[1],
                    bottom: config.containerPadding[0],
                    left: config.containerPadding[1]
                };
            }
            else if (config.containerPadding.length === 4) {
                this._padding = {
                    top: config.containerPadding[0],
                    right: config.containerPadding[1],
                    bottom: config.containerPadding[2],
                    left: config.containerPadding[3]
                };
            }
            else {
                this._padding = { top: 0, right: 0, bottom: 0, left: 0 };
            }
        }
        else {
            const pad = config.containerPadding || 0;
            this._padding = { top: pad, right: pad, bottom: pad, left: pad };
        }
        // Add initial children if provided
        if (config.children) {
            this.addChildren(...config.children);
        }
    }
    InitComponent() {
        // Initialize children array if not already done
        if (!this._children) {
            this._children = [];
        }
        // Container doesn't need visual initialization
        this.updateLayout();
    }
    Render() {
        this._graphics.clear();
        // Optionally draw background/border for debugging
        if (this._debugRive) {
            this._graphics.lineStyle(1, 0xFF00FF, 0.5);
            this._graphics.drawRect(0, 0, this.width, this.height);
        }
    }
    /**
     * Add child components
     */
    addChildren(...children) {
        for (const child of children) {
            this._children.push(child);
            // Set parent reference if available
            if ('SetParent' in child) {
                child.SetParent(this);
            }
        }
        this.updateLayout();
    }
    /**
     * Remove child component
     */
    removeChild(child) {
        const index = this._children.indexOf(child);
        if (index !== -1) {
            this._children.splice(index, 1);
            // Clear parent reference
            if ('SetParent' in child) {
                child.SetParent(null);
            }
            this.updateLayout();
        }
    }
    /**
     * Remove all children
     */
    removeAllChildren() {
        for (const child of this._children) {
            if ('SetParent' in child) {
                child.SetParent(null);
            }
        }
        this._children = [];
        this.updateLayout();
    }
    /**
     * Get all children
     */
    getChildren() {
        return [...this._children];
    }
    /**
     * Update layout of children
     */
    updateLayout() {
        if (this._children.length === 0)
            return;
        const isRow = this._direction === 'row';
        const availableWidth = this.width - this._padding.left - this._padding.right;
        const availableHeight = this.height - this._padding.top - this._padding.bottom;
        // Calculate total size needed
        let totalMainSize = 0;
        let maxCrossSize = 0;
        for (const child of this._children) {
            if (isRow) {
                totalMainSize += child.width;
                maxCrossSize = Math.max(maxCrossSize, child.height);
            }
            else {
                totalMainSize += child.height;
                maxCrossSize = Math.max(maxCrossSize, child.width);
            }
        }
        // Add gaps
        totalMainSize += this._gap * (this._children.length - 1);
        // Auto-size container if enabled
        if (this._autoSize) {
            if (isRow) {
                this.width = totalMainSize + this._padding.left + this._padding.right;
                this.height = maxCrossSize + this._padding.top + this._padding.bottom;
            }
            else {
                this.width = maxCrossSize + this._padding.left + this._padding.right;
                this.height = totalMainSize + this._padding.top + this._padding.bottom;
            }
        }
        // Calculate starting position based on justification
        let mainPos = this.calculateMainStartPosition(isRow ? availableWidth : availableHeight, totalMainSize);
        // Position each child
        for (let i = 0; i < this._children.length; i++) {
            const child = this._children[i];
            // Calculate cross-axis position based on alignment
            const crossPos = this.calculateCrossPosition(child, isRow ? availableHeight : availableWidth, isRow ? child.height : child.width);
            // Set position
            if (isRow) {
                child.x = this.x + this._padding.left + mainPos;
                child.y = this.y + this._padding.top + crossPos;
                mainPos += child.width + this._gap;
            }
            else {
                child.x = this.x + this._padding.left + crossPos;
                child.y = this.y + this._padding.top + mainPos;
                mainPos += child.height + this._gap;
            }
        }
        // Handle special justifications
        if (this._justify === 'space-between' || this._justify === 'space-around' || this._justify === 'space-evenly') {
            this.applySpaceJustification(isRow, availableWidth, availableHeight);
        }
        this.Render();
    }
    calculateMainStartPosition(availableSize, totalSize) {
        switch (this._justify) {
            case 'center':
                return (availableSize - totalSize) / 2;
            case 'end':
                return availableSize - totalSize;
            case 'space-between':
            case 'space-around':
            case 'space-evenly':
                return 0; // Will be handled separately
            default: // 'start'
                return 0;
        }
    }
    calculateCrossPosition(child, availableSize, childSize) {
        switch (this._align) {
            case 'center':
                return (availableSize - childSize) / 2;
            case 'end':
                return availableSize - childSize;
            case 'stretch':
                // TODO: Implement stretch by resizing child
                return 0;
            default: // 'start'
                return 0;
        }
    }
    applySpaceJustification(isRow, availableWidth, availableHeight) {
        if (this._children.length <= 1)
            return;
        const availableSize = isRow ? availableWidth : availableHeight;
        let totalChildSize = 0;
        for (const child of this._children) {
            totalChildSize += isRow ? child.width : child.height;
        }
        let spacing;
        let startOffset;
        switch (this._justify) {
            case 'space-between':
                spacing = (availableSize - totalChildSize) / (this._children.length - 1);
                startOffset = 0;
                break;
            case 'space-around':
                spacing = (availableSize - totalChildSize) / this._children.length;
                startOffset = spacing / 2;
                break;
            case 'space-evenly':
                spacing = (availableSize - totalChildSize) / (this._children.length + 1);
                startOffset = spacing;
                break;
            default:
                return;
        }
        let pos = startOffset;
        for (const child of this._children) {
            if (isRow) {
                child.x = this.x + this._padding.left + pos;
                pos += child.width + spacing;
            }
            else {
                child.y = this.y + this._padding.top + pos;
                pos += child.height + spacing;
            }
        }
    }
    /**
     * Update container
     */
    Update(time, frameCount, onceSecond) {
        super.Update(time, frameCount, onceSecond);
        // Update all children
        for (const child of this._children) {
            child.Update(time, frameCount, onceSecond);
        }
    }
    /**
     * Set layout direction
     */
    setDirection(direction) {
        this._direction = direction;
        this.updateLayout();
    }
    /**
     * Set justification
     */
    setJustify(justify) {
        this._justify = justify;
        this.updateLayout();
    }
    /**
     * Set alignment
     */
    setAlign(align) {
        this._align = align;
        this.updateLayout();
    }
    /**
     * Set gap between items
     */
    setGap(gap) {
        this._gap = gap;
        this.updateLayout();
    }
    /**
     * Dispose container and all children
     */
    Dispose() {
        // Dispose all children
        for (const child of this._children) {
            child.Dispose();
        }
        this._children = [];
        super.Dispose();
    }
}
