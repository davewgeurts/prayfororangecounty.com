export var OBJECT_SCALE_MODE;
(function (OBJECT_SCALE_MODE) {
    OBJECT_SCALE_MODE["MANUAL"] = "MANUAL";
    OBJECT_SCALE_MODE["FIT"] = "FIT";
    OBJECT_SCALE_MODE["FILL"] = "FILL";
    OBJECT_SCALE_MODE["STRETCH"] = "STRETCH";
    OBJECT_SCALE_MODE["LAYOUT"] = "LAYOUT"; // Rive responsive layout: artboard resized to fill the canvas; groups reflow via Fit.layout
})(OBJECT_SCALE_MODE || (OBJECT_SCALE_MODE = {}));
export var OBJECT_SCALE_ALIGN;
(function (OBJECT_SCALE_ALIGN) {
    OBJECT_SCALE_ALIGN["DEFAULT"] = "default";
    OBJECT_SCALE_ALIGN["TOP"] = "top";
    OBJECT_SCALE_ALIGN["BOTTOM"] = "bottom";
    OBJECT_SCALE_ALIGN["BOTTOM_CENTER"] = "bottom-center";
    OBJECT_SCALE_ALIGN["LEFT"] = "left";
    OBJECT_SCALE_ALIGN["RIGHT"] = "right";
    OBJECT_SCALE_ALIGN["CENTER"] = "center";
    OBJECT_SCALE_ALIGN["TOP_CENTER"] = "top-center";
    OBJECT_SCALE_ALIGN["TOP_LEFT"] = "top-left";
    OBJECT_SCALE_ALIGN["TOP_RIGHT"] = "top-right";
    OBJECT_SCALE_ALIGN["BOTTOM_LEFT"] = "bottom-left";
    OBJECT_SCALE_ALIGN["BOTTOM_RIGHT"] = "bottom-right";
})(OBJECT_SCALE_ALIGN || (OBJECT_SCALE_ALIGN = {}));
export class GlobalUIDGenerator {
    static generateUID() { return `obj_${++this.currentId}`; }
    static generateUniqueString(baseString) {
        if (!this.uniqueIds[baseString]) {
            this.uniqueIds[baseString] = 1;
        }
        else {
            this.uniqueIds[baseString]++;
        }
        return `${baseString}_${this.uniqueIds[baseString]}`;
    }
    static clear() {
        this.currentId = 0;
        this.uniqueIds = {};
    }
}
GlobalUIDGenerator.currentId = 0;
GlobalUIDGenerator.uniqueIds = {};
export class BaseCanvasObj {
    get uuid() { return this._uuid; }
    get id() { return (this._id != '') ? this._id : this._uuid; }
    get label() { return this._label; }
    get defObj() { return this._defObj; }
    SetParent(parent) {
        //console.log('_canvasCanvasObj--->'+this.id+':'+this.label+'< SET PARENT ))> '+((parent) ? parent.id+':'+parent.label : 'null'));
        const hadParent = this._parent !== null;
        const willHaveParent = parent !== null;
        this._parent = parent;
        // Trigger hooks based on parent state change
        if (willHaveParent && !hadParent) {
            // Just got added to engine/container
            this.OnParentAdded();
        }
        else if (!willHaveParent && hadParent) {
            // Just removed from engine/container
            this.OnParentRemoved();
        }
    }
    get parent() { return this._parent; }
    //public baseX:number;
    //public baseY:number;
    //public baseWidth:number;
    //public baseHeight:number;
    //public baseXScale:number;
    //public baseYScale:number;
    get resolutionScale() { return this._resolutionScale; }
    get transformedWidth() { return this._transformedWidth; }
    get transformedHeight() { return this._transformedHeight; }
    get transformedX() { return this._transformedX; }
    get transformedY() { return this._transformedY; }
    get visualXOffset() { return this._visualXOffset; }
    set visualXOffset(value) { this._visualXOffset = value; }
    get visualYOffset() { return this._visualYOffset; }
    set visualYOffset(value) { this._visualYOffset = value; }
    /**
     * Set both visual offsets at once
     * @param xOffset Horizontal offset (positive = right)
     * @param yOffset Vertical offset (positive = down)
     */
    SetVisualOffset(xOffset, yOffset) {
        this._visualXOffset = xOffset;
        this._visualYOffset = yOffset;
    }
    constructor(defObj) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        this._uuid = "";
        this._id = "";
        this._label = "";
        this._defObj = null;
        this.enabled = true;
        this.centerLocally = false;
        this.centerGlobally = false;
        /**
         * When true, this object manages its own visibility independently from its parent.
         * Parent visibility changes will not affect this object's visibility.
         */
        this.independentVisibility = false;
        this.group = "main";
        this.width = 0;
        this.height = 0;
        this._parent = null;
        // Store world coordinates separately for rendering (calculated by parent)
        this._worldX = 0;
        this._worldY = 0;
        this._worldXScale = 1;
        this._worldYScale = 1;
        this.constrainProportions = false;
        this._resolutionScale = -1;
        this._transformedWidth = -1;
        this._transformedWidthlast = -1;
        this._transformedHeight = -1;
        this._transformedHeightlast = -1;
        this._transformedX = -1;
        this._transformedXlast = -1;
        this._transformedY = -1;
        this._transformedYlast = -1;
        this._objBoundsReuse = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
        // Visual offset - shifts rendered visual relative to x,y position
        // x,y represents collision/physics center, visual offset shifts the artwork
        this._visualXOffset = 0;
        this._visualYOffset = 0;
        this._body = null;
        this._disposed = false;
        this._propertyChangeListeners = new Map();
        this._OnZIndexChanged = null;
        this._OnDispose = null;
        this._debugRive = (_a = defObj.debugMode) !== null && _a !== void 0 ? _a : false;
        this._debugLogs = (_b = defObj.debugLogs) !== null && _b !== void 0 ? _b : false;
        this._defObj = defObj;
        this._uuid = GlobalUIDGenerator.generateUID();
        this._label = (_c = this.defObj.label) !== null && _c !== void 0 ? _c : GlobalUIDGenerator.generateUniqueString(this.constructor.name);
        this._state = { x: (_d = defObj.x) !== null && _d !== void 0 ? _d : 0, y: (_e = defObj.y) !== null && _e !== void 0 ? _e : 0, z: (_f = defObj.z) !== null && _f !== void 0 ? _f : 0, xScale: (_g = defObj.xScale) !== null && _g !== void 0 ? _g : 1, yScale: (_h = defObj.yScale) !== null && _h !== void 0 ? _h : 1, visible: (_j = defObj.visible) !== null && _j !== void 0 ? _j : true, render: (_k = defObj.render) !== null && _k !== void 0 ? _k : true };
        //console.log("");
        //console.log("CanvasObj["+this._uuid+"] / "+this._label+"  created. pos=<"+this._state.x+","+this._state.y+">  size=<"+defObj.width+","+defObj.height+">  scale=<"+this._state.xScale+","+this._state.yScale+"> ");
        this.centerLocally = (_l = defObj.centerLocally) !== null && _l !== void 0 ? _l : false;
        this.centerGlobally = (_m = defObj.centerGlobally) !== null && _m !== void 0 ? _m : false;
        this.group = (_o = this.defObj.group) !== null && _o !== void 0 ? _o : "main";
        this.width = (_p = this.defObj.width) !== null && _p !== void 0 ? _p : 0;
        this.height = (_q = this.defObj.height) !== null && _q !== void 0 ? _q : 0;
        this.constrainProportions = (_r = this.defObj.constrainProportions) !== null && _r !== void 0 ? _r : false;
        //this.baseX = defObj.x ?? 0;
        //this.baseY = defObj.y ?? 0;
        //this.baseWidth = defObj.width ?? 1;
        //this.baseHeight = defObj.height ?? 1;
        //this.baseXScale = defObj.xScale ?? 1;
        //this.baseYScale = defObj.yScale ?? 1;
        //console.log("CanvasObj["+this._uuid+"]   pos=<"+this.baseX+","+this.baseY+">  size=<"+this.width+","+this.height+">  scale=<"+this.baseXScale+","+this.baseYScale+"> ");
        this._state = new Proxy(this._state, {
            set: (target, key, value) => {
                var _a;
                if (typeof key === 'string') {
                    const typedKey = key;
                    const oldValue = target[typedKey];
                    if (oldValue !== value) {
                        target[typedKey] = value;
                        (_a = this._propertyChangeListeners.get(key)) === null || _a === void 0 ? void 0 : _a(oldValue, value);
                    }
                }
                return true;
            },
        });
    }
    //public UpdateBaseProps()
    //{
    //	this.baseX = this._state.x;
    //	this.baseY = this._state.y;
    //	this.baseWidth = this.width;
    //	this.baseHeight = this.height;
    //	this.baseXScale = this._state.xScale;
    //	this.baseYScale = this._state.yScale;
    //	this.visible = this._state.visible;
    //	//console.log("CanvasObj["+this._uuid+"]   pos=<"+this.baseX+","+this.baseY+">  size=<"+this.width+","+this.height+">  scale=<"+this.baseXScale+","+this.baseYScale+"> ");
    //}
    get visible() {
        var _a;
        return (_a = this._state.visible) !== null && _a !== void 0 ? _a : true;
    }
    set visible(value) {
        if (value == this._state.visible)
            return;
        this._state.visible = value;
    }
    get render() {
        var _a;
        return (_a = this._state.render) !== null && _a !== void 0 ? _a : true;
    }
    set render(value) {
        if (value == this._state.render)
            return;
        this._state.render = value;
    }
    get x() { return this._state.x; }
    set x(value) {
        if (value == this._state.x)
            return;
        //console.log('__CanvasObj['+this._uuid+']  set x='+value);
        this._state.x = value;
        if (this._resolutionScale !== -1)
            this.ApplyResolutionScale(this._resolutionScale, "x");
    }
    get y() { return this._state.y; }
    set y(value) {
        this._state.y = value;
        if (this._resolutionScale !== -1)
            this.ApplyResolutionScale(this._resolutionScale, "y");
    }
    get z() { return this._state.z; }
    set z(value) {
        var _a;
        if (this._state.z !== value) {
            const oldZ = this._state.z;
            this._state.z = value;
            (_a = this._OnZIndexChanged) === null || _a === void 0 ? void 0 : _a.call(this, this, oldZ, this._state.z);
        }
    }
    get xScale() { return this._state.xScale; }
    set xScale(value) {
        this._state.xScale = value;
        if (this._resolutionScale !== -1)
            this.ApplyResolutionScale(this._resolutionScale, "xScale");
    }
    get yScale() { return this._state.yScale; }
    set yScale(value) {
        this._state.yScale = value;
        if (this._resolutionScale !== -1)
            this.ApplyResolutionScale(this._resolutionScale, "yScale");
    }
    get renderX() {
        return this._parent ? this._worldX : this._state.x;
    }
    get renderY() {
        return this._parent ? this._worldY : this._state.y;
    }
    get renderXScale() {
        return this._parent ? this._worldXScale : this._state.xScale;
    }
    get renderYScale() {
        return this._parent ? this._worldYScale : this._state.yScale;
    }
    InitVisuals() {
    }
    // Called by CanvasEngine after the canvas is resized. Override in subclasses to
    // respond (e.g. CanvasRiveObj resizes its artboard for Fit.layout responsive layout).
    // canvasWidth/canvasHeight are in CSS pixels; scale is the current resolution scale.
    OnCanvasResize(_canvasWidth, _canvasHeight, _scale) {
    }
    ApplyResolutionScale(scale, property = "") {
        if (scale !== this._resolutionScale) {
            //console.log(""+this.label+"  1 * "+scale+" ");
            property = "*";
            this._resolutionScale = scale;
        }
        else {
            //console.log(""+this.label+"  2 ! "+scale+" ");
        }
        //console.log('%c '+this.label+' ApplyResolutionScale() scale='+scale+', property='+property,'color:#c94fff');
        //console.log(""+this.label+"  3 prop="+property+" ");
        if ((property == "*") || (property == "x" && this._transformedXlast != this.x)) {
            this._transformedX = this.x * scale;
            this._transformedXlast = this.x;
            //console.log(""+this.label+"APRS  4 x "+this.x+"--"+this._transformedX);
        }
        if ((property == "*") || (property == "y" && this._transformedYlast != this.y)) {
            this._transformedY = this.y * scale;
            this._transformedYlast = this.y;
            //console.log(""+this.label+"APRS  5 y "+this.y+"--"+this._transformedY);
        }
        if ((property == "*") || (property == "width" && this._transformedWidthlast != this.width)) {
            this._transformedWidth = this.width * scale;
            this._transformedWidthlast = this.width;
            //console.log('%c '+this.label+' 6 width '+this.width+'--TransW:'+this._transformedWidth,'color:#c94fff');
        }
        if ((property == "*") || (property == "height" && this._transformedHeightlast != this.height)) {
            this._transformedHeight = this.height * scale;
            this._transformedHeightlast = this.height;
            //console.log(""+this.label+"APRS  7 height "+this.height+"--TransH:"+this._transformedHeight);
        }
        // Scale changes affect width/height so trigger their updates when scale changes
        if ((property == "*") || (property == "xScale")) {
            this._transformedWidth = this.width * scale;
            this._transformedWidthlast = this.width;
            //console.log('%c '+this.label+' 7 width '+this.width+'--TransW:'+this._transformedWidth,'color:#c94fff');
        }
        if ((property == "*") || (property == "yScale")) {
            this._transformedHeight = this.height * scale;
            this._transformedHeightlast = this.height;
        }
    }
    Update(time, frameCount, onceSecond, onceMinute, centerWidth = 0, centerHeight = 0) {
        // Intentionally empty. Every subclass calls super.Update(), so this stays as the
        // hook - but the body it used to have wrote _objBoundsCalcs, which nothing ever
        // read, and had been commented out wholesale. centerWidth/centerHeight are only
        // still in the signature because CanvasContainerObj passes them through.
    }
    SwapDepths(other) {
        const temp = this.z;
        this.z = other.z;
        other.z = temp;
    }
    BindPropertyChange(property, callback) {
        this._propertyChangeListeners.set(property, callback);
    }
    UnbindPropertyChange(property) {
        this._propertyChangeListeners.delete(property);
    }
    set OnZIndexChanged(func) {
        this._OnZIndexChanged = func;
    }
    set OnDispose(func) {
        this._OnDispose = func;
    }
    /**
     * Hook method called when object gets a parent (added to engine/container)
     * Subclasses can override to handle initialization that requires parent context
     */
    OnParentAdded() {
        // Override in subclasses if needed
    }
    /**
     * Hook method called when object loses its parent (removed from engine/container)
     * Subclasses can override to handle cleanup that requires parent context
     */
    OnParentRemoved() {
        // Override in subclasses if needed
    }
    Dispose() {
        //console.log("Disposing CanvasObj: "+this._uuid+" / "+this._label);
        this._disposed = true;
        if (this._OnDispose) {
            this._OnDispose(this);
        }
        this._propertyChangeListeners.clear();
        this._parent = null;
        this._defObj = null;
        this._OnZIndexChanged = null;
        this._OnDispose = null;
        if (this._body) {
            this._body = null;
        }
    }
}
