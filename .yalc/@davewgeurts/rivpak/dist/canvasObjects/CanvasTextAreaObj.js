import * as PIXI from "pixi.js";
import { CanvasPixiShapeObj } from "./CanvasPixiShapeObj";
import { CanvasTextObject } from "./CanvasTextObj";
import { CanvasEngine } from "../useCanvasEngine";
import { PixiController } from "../controllers/PixiController";
export class CanvasTextAreaObj extends CanvasPixiShapeObj {
    constructor(canvasDef) {
        super(canvasDef);
        this._textLines = null;
        this._backgroundGraphics = null;
        this._shadowGraphics = null;
        this._lines = null;
        this._lineHeight = 0;
        this._maxLines = 0;
        this._lineSpacing = 0;
        this._background = null;
        this._textStyle = null;
        this._lastLinesHash = null;
        this._scrollToBottom = false;
    }
    get canvasTextAreaDef() {
        return this.defObj;
    }
    InitVisuals() {
        var _a, _b, _c, _d, _e, _f, _g;
        // Initialize our properties
        this._textLines = [];
        this._backgroundGraphics = null;
        this._lines = this.canvasTextAreaDef.lines || [];
        this._lineHeight = this.canvasTextAreaDef.lineHeight || 24;
        this._maxLines = this.canvasTextAreaDef.maxLines || 20;
        this._lineSpacing = this.canvasTextAreaDef.lineSpacing || 0;
        this._textStyle = this.canvasTextAreaDef.textStyle || {};
        this._background = this.canvasTextAreaDef.background || {
            enabled: false
        };
        // Set up dimensions and position
        this.width = (_a = this.canvasTextAreaDef.width) !== null && _a !== void 0 ? _a : 400;
        this.height = (_b = this.canvasTextAreaDef.height) !== null && _b !== void 0 ? _b : (this._maxLines * (this._lineHeight + this._lineSpacing));
        this.xScale = (_c = this.canvasTextAreaDef.xScale) !== null && _c !== void 0 ? _c : 1;
        this.yScale = (_d = this.canvasTextAreaDef.yScale) !== null && _d !== void 0 ? _d : 1;
        this.x = (_e = this.canvasTextAreaDef.x) !== null && _e !== void 0 ? _e : 0;
        this.y = (_f = this.canvasTextAreaDef.y) !== null && _f !== void 0 ? _f : 0;
        this.z = (_g = this.canvasTextAreaDef.z) !== null && _g !== void 0 ? _g : 0;
        if (this.centerGlobally) {
            this.x = CanvasEngine.get().width / 2;
            this.y = CanvasEngine.get().height / 2;
        }
        if (this.centerGlobally || this.centerLocally) {
            this.x -= (this.width / 2);
            this.y -= (this.height / 2);
        }
        const scaledWidth = this.width * this.xScale;
        const scaledHeight = this.height * this.yScale;
        this._objBoundsReuse.minX = this.x;
        this._objBoundsReuse.minY = this.y;
        this._objBoundsReuse.maxX = this.x + scaledWidth;
        this._objBoundsReuse.maxY = this.y + scaledHeight;
        super.InitVisuals();
        this.createBackground();
        this.createTextLines();
    }
    getMaxTextWidth() {
        let maxWidth = 0;
        for (const line of this._textLines || []) {
            const lineBounds = line.GetTextBounds();
            if (lineBounds) {
                maxWidth = Math.max(maxWidth, lineBounds.width);
            }
        }
        return maxWidth;
    }
    createBackground() {
        var _a, _b;
        const debug = false;
        if (debug)
            console.log('%c ** CTAO :: createBackground() ** ', "color:#00FF00; font-weight:bold;");
        if (!this._background || !this._background.enabled)
            return;
        if (debug)
            console.log('%c ** CTAO :: createBackground() ** 1', "color:#00FF00; font-weight:bold;");
        // Clean up existing graphics
        if (this._backgroundGraphics) {
            (_a = PixiController.get().GetStageOrNull(this.defObj.pixiLayer)) === null || _a === void 0 ? void 0 : _a.removeChild(this._backgroundGraphics);
            this._backgroundGraphics.destroy();
            this._backgroundGraphics = null;
        }
        if (this._shadowGraphics) {
            (_b = PixiController.get().GetStageOrNull(this.defObj.pixiLayer)) === null || _b === void 0 ? void 0 : _b.removeChild(this._shadowGraphics);
            this._shadowGraphics.destroy();
            this._shadowGraphics = null;
        }
        this._backgroundGraphics = new PIXI.Graphics();
        this._backgroundGraphics.zIndex = 210;
        if (debug)
            console.log('%c ** CTAO :: createBackground() ** 2', "color:#00FF00; font-weight:bold;");
        const padding = this._background.padding || 0;
        // Draw at origin, position will be set via x,y properties
        const x = 0;
        const y = 0;
        // Calculate height based on autoSize setting (includes padding)
        let height;
        let width;
        if (this._background.autoSize && this._lines) {
            const visibleLines = this._lines.length;
            const lineCount = Math.max(1, visibleLines);
            height = (lineCount * this._lineHeight) + ((lineCount - 1) * this._lineSpacing) + (padding * 2);
            width = this.getMaxTextWidth() + (padding * 2);
        }
        else {
            width = this.width + (padding * 2);
            height = this.height + (padding * 2);
        }
        //const width = this.width + (padding * 2);
        const radius = this._background.borderRadius || 0;
        // Add shadow if enabled
        if (this._background.shadowBlur || this._background.shadowDistance) {
            this._shadowGraphics = new PIXI.Graphics();
            this._shadowGraphics.zIndex = 201;
            const shadowColor = this._background.shadowColor || 0x000000;
            const shadowAlpha = this._background.shadowAlpha || 0.5;
            const shadowDistance = this._background.shadowDistance || 5;
            const shadowAngle = this._background.shadowAngle || Math.PI / 4;
            // Draw shadow at origin with offset
            const shadowOffsetX = Math.cos(shadowAngle) * shadowDistance;
            const shadowOffsetY = Math.sin(shadowAngle) * shadowDistance;
            this._shadowGraphics.alpha = shadowAlpha;
            if (radius > 0) {
                this._shadowGraphics.roundRect(shadowOffsetX, shadowOffsetY, width, height, radius);
            }
            else {
                this._shadowGraphics.rect(shadowOffsetX, shadowOffsetY, width, height);
            }
            this._shadowGraphics.fill(shadowColor);
            if (this._background.shadowBlur && this._background.shadowBlur > 0) {
                const blurFilter = new PIXI.BlurFilter({
                    strength: this._background.shadowBlur,
                    quality: 4
                });
                this._shadowGraphics.filters = [blurFilter];
            }
            this._shadowGraphics.x = this.x;
            this._shadowGraphics.y = this.y;
            PixiController.get().GetPixiInstance(this.defObj.pixiLayer).stage.addChild(this._shadowGraphics);
        }
        // Draw border if specified
        if (this._background.borderWidth && this._background.borderWidth > 0) {
            if (debug)
                console.log('%c ** CTAO :: createBackground() ** 4', "color:#00FF00; font-weight:bold;");
            const borderColor = this._background.borderColor || 0x000000;
            const borderAlpha = this._background.borderAlpha || 1;
            this._backgroundGraphics.stroke({
                color: borderColor,
                width: this._background.borderWidth,
                alpha: borderAlpha
            });
        }
        // Draw fill
        if (this._background.fill) {
            if (debug)
                console.log('%c ** CTAO :: createBackground() ** 5', "color:#00FF00; font-weight:bold;");
            if (Array.isArray(this._background.fill) && this._background.fill.length > 1) {
                const colors = this._background.fill;
                const firstColor = typeof colors[0] === 'string' ? colors[0] : colors[0];
                this._backgroundGraphics.fill(firstColor);
            }
            else {
                // Solid fill
                const fillColor = Array.isArray(this._background.fill)
                    ? this._background.fill[0]
                    : this._background.fill;
                this._backgroundGraphics.fill(fillColor);
            }
        }
        if (debug)
            console.log('%c ** CTAO :: createBackground() ** 6', "color:#00FF00; font-weight:bold;");
        // Draw the shape
        if (radius > 0) {
            if (debug)
                console.log('%c ** CTAO :: createBackground() ** 7 x:' + x + ', y:' + y + ', width:' + width + ', height:' + height + ', radius:' + radius, "color:#798cff; font-weight:bold;");
            this._backgroundGraphics.roundRect(x, y, width, height, radius);
        }
        else {
            if (debug)
                console.log('%c ** CTAO :: createBackground() ** 8 x:' + x + ', y:' + y + ', width:' + width + ', height:' + height + ', radius:' + radius, "color:#798cff; font-weight:bold;");
            this._backgroundGraphics.rect(x, y, width, height);
        }
        this._backgroundGraphics.fill();
        this._backgroundGraphics.alpha = this._background.alpha || 1;
        this._backgroundGraphics.x = this.x;
        this._backgroundGraphics.y = this.y;
        // Add to stage
        PixiController.get().GetPixiInstance(this.defObj.pixiLayer).stage.addChild(this._backgroundGraphics);
    }
    createTextLines() {
        var _a;
        if (this._textLines === null)
            return;
        // Clear existing text lines
        this.clearTextLines();
        const padding = ((_a = this._background) === null || _a === void 0 ? void 0 : _a.padding) || 0;
        const startZ = 520;
        //console.log(`%c CanvasTextAreaObj :: createTextLines() base x=${this.x}, y=${this.y}, padding=${padding}`, 'color:#FF00FF; font-weight:bold;');
        // Create new text lines
        for (let i = 0; i < this._maxLines; i++) {
            const textX = this.x + padding;
            const textY = this.y + padding + (i * (this._lineHeight + this._lineSpacing));
            const textLine = new CanvasTextObject({
                label: `${this.defObj.label}_Line${i}`,
                text: '',
                width: this.width,
                height: this._lineHeight,
                x: textX,
                y: textY,
                z: startZ + i,
                xScale: this.xScale,
                yScale: this.yScale,
                textStyle: this._textStyle,
                textAlign: this.defObj.textAlign,
                verticalAlign: 'top',
                visible: false, // Start hidden until we have content
                pixiLayer: this.defObj.pixiLayer
            });
            //console.log('%c CanvasTextAreaObj :: createTextLines() x='+this.x,'color:#00FF00; font-weight:bold;');
            //console.log('%c CanvasTextAreaObj :: createTextLines() x='+textLine.x,'color:#00FF00; font-weight:bold;');
            //console.log('%c CanvasTextAreaObj :: createTextLines() y='+textLine.y,'color:#00FF00; font-weight:bold;');
            //console.log('%c CanvasTextAreaObj :: createTextLines() z='+textLine.z,'color:#00FF00; font-weight:bold;');
            this._textLines.push(textLine);
            CanvasEngine.get().AddCanvasObjects(textLine);
        }
        // Initialize with current lines if any
        if (this._lines && this._lines.length > 0) {
            this.updateTextLines();
        }
    }
    clearTextLines() {
        if (this._textLines && this._textLines.length > 0) {
            for (const line of this._textLines) {
                CanvasEngine.get().RemoveCanvasObjects(line);
                line.Dispose();
            }
        }
        this._textLines = [];
    }
    SetLines(lines) {
        // Create a simple hash of the lines to check if content changed
        const newLinesHash = lines.join('|||');
        // Skip update if content hasn't changed
        if (newLinesHash === this._lastLinesHash) {
            return;
        }
        this._lastLinesHash = newLinesHash;
        this._lines = lines;
        this.updateTextLines();
    }
    AddLine(line) {
        if (this._lines === null) {
            this._lines = [];
        }
        this._lines.push(line);
        // Keep only the most recent lines if we exceed maxLines (scrolling behavior)
        if (this._scrollToBottom && this._lines.length > this._maxLines) {
            this._lines = this._lines.slice(-this._maxLines);
        }
        else if (!this._scrollToBottom && this._lines.length > this._maxLines) {
            this._lines.length = this._maxLines; // Truncate oldest lines
        }
        // Update hash after modifying lines
        this._lastLinesHash = this._lines.join('|||');
        this.updateTextLines();
    }
    /**
     * Set whether to scroll to bottom when adding new lines
     */
    SetScrollToBottom(scroll) {
        this._scrollToBottom = scroll;
    }
    ClearLines() {
        this._lines = [];
        this._lastLinesHash = '';
        this.updateTextLines();
    }
    updateTextLines() {
        if (this._lines === null || this._textLines === null)
            return;
        for (let i = 0; i < this._textLines.length; i++) {
            if (i < this._lines.length && this._lines[i]) {
                this._textLines[i].SetText(this._lines[i]);
                this._textLines[i].visible = true;
            }
            else {
                this._textLines[i].SetText('');
                this._textLines[i].visible = false;
            }
        }
        // Refresh background if autoSize is enabled
        if (this._background && this._background.enabled && this._background.autoSize) {
            this.createBackground();
        }
    }
    SetTextStyle(style) {
        if (this._textLines === null)
            return;
        this._textStyle = Object.assign(Object.assign({}, this._textStyle), style);
        for (const line of this._textLines) {
            line.SetTextStyle(style);
        }
    }
    SetBackground(options) {
        this._background = Object.assign(Object.assign({}, this._background), options);
        this.createBackground();
    }
    /**
     * Get the number of lines with actual content
     */
    GetVisibleLinesCount() {
        if (!this._lines)
            return 0;
        return this._lines.filter(line => line && line.trim().length > 0).length;
    }
    /**
     * Get all current lines
     */
    GetLines() {
        return this._lines ? [...this._lines] : [];
    }
    ToggleVisibility() {
        if (this._textLines === null || this._lines === null)
            return;
        const newVisibility = !this.visible;
        this.visible = newVisibility;
        for (const line of this._textLines) {
            line.visible = newVisibility && (this._lines.indexOf(line.Text) !== -1);
        }
        if (this._backgroundGraphics) {
            this._backgroundGraphics.visible = newVisibility;
        }
    }
    Update(time, frameCount, onceSecond) {
        var _a, _b;
        if (this.enabled === false)
            return;
        let transformedX = 0;
        let xScale = 0;
        let transformedY = 0;
        let yScale = 0;
        if ((_a = CanvasEngine.get().EngineSettings) === null || _a === void 0 ? void 0 : _a.autoScale) {
            transformedX = this.renderX * CanvasEngine.get().CurrentCanvasScale;
            transformedY = this.renderY * CanvasEngine.get().CurrentCanvasScale;
            xScale = CanvasEngine.get().CurrentCanvasScale * this.renderXScale;
            yScale = CanvasEngine.get().CurrentCanvasScale * this.renderYScale;
        }
        else {
            transformedX = this.renderX;
            transformedY = this.renderY;
            xScale = this.renderXScale;
            yScale = this.renderYScale;
        }
        // Update background position if needed
        if (this._backgroundGraphics) {
            //if(onceSecond) console.log('%c ** CTAO :: BG Update() ** x='+this.x+', y='+this.y+', width='+this.width+', height='+this.height, "color:#798cff; font-weight:bold;");
            //if(onceSecond) console.log('%c ** CTAO :: BG Update() ** x='+this._backgroundGraphics.x+', y='+this._backgroundGraphics.y+', width='+this._backgroundGraphics.width+', height='+this._backgroundGraphics.height, "color:#798cff; font-weight:bold;");
            this._backgroundGraphics.x = transformedX;
            this._backgroundGraphics.y = transformedY;
            if (this._shadowGraphics) {
                this._shadowGraphics.x = transformedX;
                this._shadowGraphics.y = transformedY;
            }
            if ((_b = CanvasEngine.get().EngineSettings) === null || _b === void 0 ? void 0 : _b.autoScale) {
                const scale = CanvasEngine.get().CurrentCanvasScale;
                this._backgroundGraphics.scale.set(xScale, yScale);
                if (this._shadowGraphics) {
                    this._shadowGraphics.scale.set(xScale, yScale);
                }
            }
        }
        super.Update(time, frameCount, onceSecond);
    }
    Dispose() {
        var _a, _b;
        this.clearTextLines();
        if (this._backgroundGraphics) {
            (_a = PixiController.get().GetStageOrNull(this.defObj.pixiLayer)) === null || _a === void 0 ? void 0 : _a.removeChild(this._backgroundGraphics);
            this._backgroundGraphics.destroy();
            this._backgroundGraphics = null;
        }
        if (this._shadowGraphics) {
            (_b = PixiController.get().GetStageOrNull(this.defObj.pixiLayer)) === null || _b === void 0 ? void 0 : _b.removeChild(this._shadowGraphics);
            this._shadowGraphics.destroy();
            this._shadowGraphics = null;
        }
        super.Dispose();
    }
}
