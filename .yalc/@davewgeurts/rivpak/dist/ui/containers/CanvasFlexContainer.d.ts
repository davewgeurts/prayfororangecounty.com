/**
 * Canvas Flex Container - Layout container for UI components
 */
import { BaseUIComponent, UIComponentConfig } from "../base/BaseUIComponent";
export interface FlexContainerConfig extends UIComponentConfig {
    direction?: 'row' | 'column';
    justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
    align?: 'start' | 'center' | 'end' | 'stretch';
    gap?: number;
    containerPadding?: number | [number, number] | [number, number, number, number];
    wrap?: boolean;
    autoSize?: boolean;
    children?: BaseUIComponent[];
}
export declare class CanvasFlexContainer extends BaseUIComponent {
    private _flexConfig;
    private _children;
    private _direction;
    private _justify;
    private _align;
    private _gap;
    private _padding;
    private _wrap;
    private _autoSize;
    constructor(config: FlexContainerConfig);
    protected InitComponent(): void;
    protected Render(): void;
    /**
     * Add child components
     */
    addChildren(...children: BaseUIComponent[]): void;
    /**
     * Remove child component
     */
    removeChild(child: BaseUIComponent): void;
    /**
     * Remove all children
     */
    removeAllChildren(): void;
    /**
     * Get all children
     */
    getChildren(): BaseUIComponent[];
    /**
     * Update layout of children
     */
    private updateLayout;
    private calculateMainStartPosition;
    private calculateCrossPosition;
    private applySpaceJustification;
    /**
     * Update container
     */
    Update(time: number, frameCount: number, onceSecond: boolean): void;
    /**
     * Set layout direction
     */
    setDirection(direction: 'row' | 'column'): void;
    /**
     * Set justification
     */
    setJustify(justify: string): void;
    /**
     * Set alignment
     */
    setAlign(align: string): void;
    /**
     * Set gap between items
     */
    setGap(gap: number): void;
    /**
     * Dispose container and all children
     */
    Dispose(): void;
}
