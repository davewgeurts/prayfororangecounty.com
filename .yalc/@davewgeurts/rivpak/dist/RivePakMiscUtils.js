export default class RivePakUtils {
    static get() { if (RivePakUtils.myInstance == null) {
        RivePakUtils.myInstance = new RivePakUtils();
    } return this.myInstance; }
    /** Try to read a "value" from different property shapes safely. */
    static _readPropValueSafe(obj, key) {
        try {
            if (!obj)
                return undefined;
            // Common patterns: obj[key], obj.get(key), obj.value, obj.defaultValue, obj.initialValue, obj.current, etc.
            if (key in obj)
                return obj[key];
            if (this._isFn(obj, "get"))
                return obj.get(key);
            if ("value" in obj)
                return obj.value;
            if ("defaultValue" in obj)
                return obj.defaultValue;
            if ("initialValue" in obj)
                return obj.initialValue;
            if ("current" in obj)
                return obj.current;
        }
        catch (_a) { }
        return undefined;
    }
    /** Dump all enums declared in a RiveFile (names + options). */
    static DumpEnums(file) {
        var _a, _b, _c;
        try {
            if (!this._isFn(file, "enums")) {
                console.log("No enums() on file.");
                return;
            }
            const enums = (_c = (_b = (_a = file).enums) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : [];
            console.log("🧩 Rive Enums (count:", enums.length, "):");
            enums.forEach((e, idx) => {
                var _a, _b, _c;
                const name = (_a = e === null || e === void 0 ? void 0 : e.name) !== null && _a !== void 0 ? _a : `(enum-${idx})`;
                const opts = this._isFn(e, "options") ? e.options() : ((_c = (_b = e === null || e === void 0 ? void 0 : e.options) !== null && _b !== void 0 ? _b : e === null || e === void 0 ? void 0 : e.values) !== null && _c !== void 0 ? _c : []);
                console.log(`  • ${name}`, opts ? `options: ${JSON.stringify(opts)}` : "(no options API?)");
            });
        }
        catch (e) {
            console.log("dumpEnums error:", e);
        }
    }
    /** Return best ViewModel match for an artboard. */
    static PickBestViewModel(file, artboard, requestedName) {
        // 1) explicit by name
        if (requestedName && this._isFn(file, "viewModelByName")) {
            const v = file.viewModelByName(requestedName);
            if (v)
                return v;
        }
        // 2) artboard-default
        if (this._isFn(file, "defaultArtboardViewModel")) {
            const v = file.defaultArtboardViewModel(artboard);
            if (v)
                return v;
        }
        // 3) exact artboard-name match if available in VM names
        if (this._isFn(file, "viewModelCount") && this._isFn(file, "viewModelByIndex")) {
            const count = file.viewModelCount();
            for (let i = 0; i < count; i++) {
                const vm = file.viewModelByIndex(i);
                if ((vm === null || vm === void 0 ? void 0 : vm.name) === (artboard === null || artboard === void 0 ? void 0 : artboard.name))
                    return vm;
            }
        }
        // 4) first VM fallback
        if (this._isFn(file, "viewModelByIndex") && this._isFn(file, "viewModelCount")) {
            const first = file.viewModelCount() > 0 ? file.viewModelByIndex(0) : null;
            if (first)
                return first;
        }
        return null;
    }
    /** Make a VMI with preference order: instanceByName > defaultInstance > instance. */
    static MakeBestVMI(vm, artboard, instanceName) {
        var _a, _b, _c, _d;
        try {
            if (instanceName && this._isFn(vm, "instanceByName")) {
                const vmi = vm.instanceByName(instanceName);
                if (vmi)
                    return vmi;
            }
            if (this._isFn(vm, "defaultInstance")) {
                const vmi = (_b = (_a = vm).defaultInstance) === null || _b === void 0 ? void 0 : _b.call(_a);
                if (vmi)
                    return vmi;
            }
            if (this._isFn(vm, "instance")) {
                const vmi = (_d = (_c = vm).instance) === null || _d === void 0 ? void 0 : _d.call(_c);
                if (vmi)
                    return vmi;
            }
        }
        catch (e) {
            console.log("makeBestVMI error:", e);
        }
        return null;
    }
    /** Dump one ViewModel’s metadata. */
    static DumpViewModel(vm) {
        var _a, _b, _c, _d, _e;
        try {
            const count = this._isFn(vm, "instanceCount") ? vm.instanceCount() : undefined;
            const names = this._isFn(vm, "getInstanceNames") ? vm.getInstanceNames() : undefined;
            const props = this._isFn(vm, "getProperties") ? vm.getProperties() : undefined;
            console.log(`📦 ViewModel "${(_a = vm === null || vm === void 0 ? void 0 : vm.name) !== null && _a !== void 0 ? _a : "unnamed"}"`, { instanceCount: count, instanceNames: names });
            if (Array.isArray(props)) {
                console.log(`  Properties (${props.length}):`);
                for (const p of props) {
                    const pName = (_b = p === null || p === void 0 ? void 0 : p.name) !== null && _b !== void 0 ? _b : "(unnamed)";
                    const pType = (_d = (_c = p === null || p === void 0 ? void 0 : p.type) !== null && _c !== void 0 ? _c : p === null || p === void 0 ? void 0 : p.typeName) !== null && _d !== void 0 ? _d : this._typename(p);
                    const defVal = (_e = this._readPropValueSafe(p, "defaultValue")) !== null && _e !== void 0 ? _e : this._readPropValueSafe(p, "initialValue");
                    let enumOptions = undefined;
                    if (Array.isArray(p === null || p === void 0 ? void 0 : p.options))
                        enumOptions = p.options;
                    else if (this._isFn(p, "options"))
                        enumOptions = p.options();
                    console.log(`   • ${pName} [${pType}] default=${JSON.stringify(defVal)}${enumOptions ? ` options=${JSON.stringify(enumOptions)}` : ""}`);
                }
            }
            else {
                console.log("  (getProperties() not available)");
            }
        }
        catch (e) {
            console.log("dumpViewModel error:", e);
        }
    }
    /** Dump a VMI's current property values. */
    static DumpVMI(vmi) {
        var _a, _b, _c, _d;
        try {
            console.log(`🔗 VMI on artboard "${(_b = (_a = vmi === null || vmi === void 0 ? void 0 : vmi.artboard) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "?"}"`);
            const props = this._isFn(vmi, "getProperties") ? vmi.getProperties() : null;
            if (!Array.isArray(props)) {
                console.log("  (VMI.getProperties() not available)");
                return;
            }
            // Prefer an API like vmi.get(name) / getPropertyValue / property.value; fallback to VM defaults if needed.
            for (const p of props) {
                const pName = (_c = p === null || p === void 0 ? void 0 : p.name) !== null && _c !== void 0 ? _c : "(unnamed)";
                let curr = undefined;
                if (this._isFn(vmi, "getPropertyValue"))
                    curr = vmi.getPropertyValue(pName);
                else if (this._isFn(vmi, "get"))
                    curr = vmi.get(pName);
                else
                    curr = (_d = this._readPropValueSafe(p, "defaultValue")) !== null && _d !== void 0 ? _d : this._readPropValueSafe(p, "initialValue");
                console.log(`   • ${pName} = ${JSON.stringify(curr)}`);
            }
        }
        catch (e) {
            console.log("dumpVMI error:", e);
        }
    }
    /** Safe enum setter on a VMI (by property + option name). */
    static SetEnumOnVMI(vmi, propName, optionName) {
        var _a, _b, _c;
        try {
            if (!vmi)
                return false;
            // Read property metadata from VMI (preferred) or from VM bound to it, if accessible
            const props = this._isFn(vmi, "getProperties") ? vmi.getProperties() : null;
            if (!Array.isArray(props)) {
                console.log("SetEnumOnVMI: no property metadata");
                return false;
            }
            const p = props.find((pp) => (pp === null || pp === void 0 ? void 0 : pp.name) === propName);
            if (!p) {
                console.log(`SetEnumOnVMI: prop "${propName}" not found`);
                return false;
            }
            let options;
            if (Array.isArray(p === null || p === void 0 ? void 0 : p.options))
                options = p.options;
            else if (this._isFn(p, "options"))
                options = p.options();
            if (!options || options.length === 0) {
                console.log(`SetEnumOnVMI: "${propName}" is not an enum or no options`);
                return false;
            }
            const match = options.find((o) => { var _a; return ((_a = o === null || o === void 0 ? void 0 : o.name) !== null && _a !== void 0 ? _a : o) === optionName || (typeof o === "string" && o === optionName); });
            if (!match) {
                console.log(`SetEnumOnVMI: option "${optionName}" not found in ${JSON.stringify(options)}`);
                return false;
            }
            // Apply: try named setter, then generic set
            if (this._isFn(vmi, "setPropertyValue")) {
                vmi.setPropertyValue(propName, (_a = match === null || match === void 0 ? void 0 : match.value) !== null && _a !== void 0 ? _a : match);
                return true;
            }
            if (this._isFn(vmi, "set")) {
                vmi.set(propName, (_b = match === null || match === void 0 ? void 0 : match.value) !== null && _b !== void 0 ? _b : match);
                return true;
            }
            // As a last resort, try write-through to property object (may be no-op if engine ignores)
            if ("value" in p) {
                p.value = (_c = match === null || match === void 0 ? void 0 : match.value) !== null && _c !== void 0 ? _c : match;
                return true;
            }
            console.log(`SetEnumOnVMI: no setter available for "${propName}"`);
            return false;
        }
        catch (e) {
            console.log("SetEnumOnVMI error:", e);
            return false;
        }
    }
    /** High-level: dump everything relevant for a file/artboard/VM/VMI. */
    static DumpRiveDiagnostics(file, artboard, vm, vmi) {
        console.log("");
        console.log("============== RIVE DIAGNOSTICS ==============");
        console.log("Artboard:", artboard === null || artboard === void 0 ? void 0 : artboard.name, " DPRUsed:", artboard === null || artboard === void 0 ? void 0 : artboard.devicePixelRatioUsed);
        this.DumpEnums(file);
        if (this._isFn(file, "viewModelCount") && this._isFn(file, "viewModelByIndex")) {
            const count = file.viewModelCount();
            console.log("📚 ViewModels (count:", count, "):");
            for (let i = 0; i < count; i++) {
                const vmI = file.viewModelByIndex(i);
                this.DumpViewModel(vmI);
            }
        }
        else {
            console.log("No viewModelCount/viewModelByIndex on file.");
        }
        if (vm) {
            console.log("— Selected VM —");
            this.DumpViewModel(vm);
        }
        else {
            console.log("No VM selected for this artboard.");
        }
        if (vmi) {
            console.log("— Bound VMI —");
            this.DumpVMI(vmi);
        }
        else {
            console.log("No VMI bound.");
        }
        console.log("==============================================");
    }
}
RivePakUtils._typename = (x) => Object.prototype.toString.call(x).slice(8, -1);
RivePakUtils._isFn = (o, k) => o && typeof o[k] === "function";
