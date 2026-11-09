class RivePakUtils {
    static get() { if (RivePakUtils.myInstance == null) {
        RivePakUtils.myInstance = new RivePakUtils();
    } return this.myInstance; }
    static get debug() { return this._debug; }
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
    /** Return best Vie wModel match for an artboard. */
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
        const debug = this._debug || false;
        try {
            //Helper to validate VMI has properties
            const isValidVMI = (vmi) => {
                var _a, _b;
                if (!vmi)
                    return false;
                try {
                    const propCount = vmi.propertyCount;
                    if (debug)
                        console.log(`  VMI propertyCount: ${propCount}`);
                    if (propCount > 0)
                        return true;
                    // Also try getting properties array
                    const props = (_a = vmi.getProperties) === null || _a === void 0 ? void 0 : _a.call(vmi);
                    if (debug)
                        console.log(`  VMI getProperties() length: ${(_b = props === null || props === void 0 ? void 0 : props.length) !== null && _b !== void 0 ? _b : 0}`);
                    return props && props.length > 0;
                }
                catch (e) {
                    console.log(`  Error checking VMI validity:`, e);
                    return false;
                }
            };
            //If we have an instance name, try to get it specifically
            if (instanceName && this._isFn(vm, "instanceByName")) {
                if (debug)
                    console.log(`Trying to get instance by name: "${instanceName}"`);
                const vmi = vm.instanceByName(instanceName);
                if (isValidVMI(vmi)) {
                    if (debug)
                        console.log(`✅ Successfully got instance by name: "${instanceName}"`);
                    return vmi;
                }
                //console.log(`❌ instanceByName("${instanceName}") returned empty/invalid VMI`);
            }
            // Try defaultInstance
            if (this._isFn(vm, "defaultInstance")) {
                if (debug)
                    console.log("Trying defaultInstance()");
                const vmi = vm.defaultInstance();
                if (isValidVMI(vmi)) {
                    if (debug)
                        console.log(`✅ Successfully got defaultInstance()`);
                    return vmi;
                }
                if (debug)
                    console.log("❌ defaultInstance() returned empty/invalid VMI");
            }
            // Try instance()
            if (this._isFn(vm, "instance")) {
                if (debug)
                    console.log("Trying instance()");
                const vmi = vm.instance();
                if (isValidVMI(vmi)) {
                    if (debug)
                        console.log(`✅ Successfully got instance()`);
                    return vmi;
                }
                if (debug)
                    console.log("❌ instance() returned empty/invalid VMI");
            }
            // Last resort: try creating a new instance
            if (this._isFn(vm, "createInstance")) {
                if (debug)
                    console.log("Trying createInstance()");
                const vmi = vm.createInstance();
                if (isValidVMI(vmi)) {
                    if (debug)
                        console.log(`✅ Successfully created new instance`);
                    return vmi;
                }
                if (debug)
                    console.log("❌ createInstance() returned empty/invalid VMI");
            }
            if (debug)
                console.log("❌ All VMI creation methods failed to return valid VMI");
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
            const degug = true;
            if (degug)
                console.log(`SetEnumOnVMI: prop="${propName}", option="${optionName}"`);
            if (!vmi) {
                if (degug)
                    console.log(`SetEnumOnVMI: BLOCK A`);
                return false;
            }
            // Read property metadata from VMI (preferred) or from VM bound to it, if accessible
            const props = this._isFn(vmi, "getProperties") ? vmi.getProperties() : null;
            if (degug)
                console.log("SetEnumOnVMI: props", props);
            if (!Array.isArray(props)) {
                console.log("SetEnumOnVMI: no property metadata");
                return false;
            }
            const p = props.find((pp) => (pp === null || pp === void 0 ? void 0 : pp.name) === propName);
            if (!p) {
                console.log(`SetEnumOnVMI: prop "${propName}" not found`);
                return false;
            }
            if (degug)
                console.log("SetEnumOnVMI: p=", p);
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
    static GetEnumIndexMap(vmi, propName) {
        var _a, _b, _c;
        console.log('GetEnumIndexMap----) 1)) * ');
        const props = (_c = (_b = (_a = vmi).getProperties) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : [];
        console.log('GetEnumIndexMap----) 2)) * ', props);
        const p = props.find((pp) => (pp === null || pp === void 0 ? void 0 : pp.name) === propName);
        console.log('GetEnumIndexMap----) 3)) * ', p);
        if (!p)
            return {};
        console.log('GetEnumIndexMap----) 4)) * ');
        let raw;
        if (Array.isArray(p === null || p === void 0 ? void 0 : p.options))
            raw = p.options;
        else if (typeof (p === null || p === void 0 ? void 0 : p.options) === "function")
            raw = p.options();
        console.log('GetEnumIndexMap----) 5)) * ', raw);
        const map = {};
        (raw !== null && raw !== void 0 ? raw : []).forEach((o, idx) => {
            var _a, _b;
            const name = typeof o === "string" ? o : ((_a = o === null || o === void 0 ? void 0 : o.name) !== null && _a !== void 0 ? _a : String(idx));
            const value = typeof o === "number" ? o : ((_b = o === null || o === void 0 ? void 0 : o.value) !== null && _b !== void 0 ? _b : idx);
            map[name] = value;
        });
        console.log('GetEnumIndexMap----) 6)) * ', map);
        return map;
    }
    //public static SetEnumOnVMI(vmi: ViewModelInstance, propName: string, option: string | number): boolean
    //{
    //	try
    //	{
    //		console.log('SetEnumOnVMI---->>>> 1)) * ');
    //		if (!vmi) return false;
    //		console.log('SetEnumOnVMI---->>>> 2)) * ');
    //		let resolved: number | undefined;
    //		console.log('SetEnumOnVMI---->>>> 3)) * ');
    //		if (typeof option === "number")
    //		{
    //			console.log('SetEnumOnVMI---->>>> 4)) * ');
    //			resolved = option;
    //		}
    //		else
    //		{
    //			console.log('SetEnumOnVMI---->>>> 5)) * ',propName);
    //			const map = this.GetEnumIndexMap(vmi, propName);
    //			console.log('SetEnumOnVMI---->>>> 6)) * m=',map);
    //			console.log('SetEnumOnVMI---->>>> 6)) * o=',option);
    //			if(option in map)
    //			{
    //				console.log('SetEnumOnVMI---->>>> 7)) * ');
    //				resolved = map[option];
    //			}
    //			else if (/^\d+$/.test(option))
    //			{
    //				console.log('SetEnumOnVMI---->>>> 8)) * ');
    //				resolved = parseInt(option, 10);
    //			}
    //		}
    //		console.log('SetEnumOnVMI---->>>> 9)) * ');
    //		if (resolved === undefined) { console.log(`SetEnumOnVMI: can't resolve`, propName, option); return false; }
    //		if ((vmi as any).setPropertyValue) { (vmi as any).setPropertyValue(propName, resolved); (vmi as any).commit?.(); return true; }
    //		if ((vmi as any).set)             { (vmi as any).set(propName, resolved);             (vmi as any).commit?.(); return true; }
    //		// last resort:
    //		const p = (vmi as any).getProperties?.().find((pp:any)=>pp?.name===propName);
    //		if (p && "value" in p) { p.value = resolved; (vmi as any).commit?.(); return true; }
    //		return false;
    //	} catch (e) { console.log("SetEnumOnVMI error:", e); return false; }
    //}
    static SetEnum(file, artboard, propName, optionName, vmName) {
        const debug = this._debug || false;
        if (debug)
            console.log(`SetEnum: artboard="${artboard === null || artboard === void 0 ? void 0 : artboard.name}", prop="${propName}", option="${optionName}", vm="${vmName}"`);
        const vm = this.PickBestViewModel(file, artboard, vmName);
        if (!vm)
            return false;
        const vmi = this.MakeBestVMI(vm, artboard);
        if (!vmi)
            return false;
        if (this._isFn(artboard, "bindViewModelInstance"))
            artboard.bindViewModelInstance(vmi);
        return this.SetEnumOnVMI(vmi, propName, optionName);
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
    /**
     * List all artboards in a RiveFile with their info.
     * Returns an array of ArtboardInfo objects.
     */
    static GetArtboards(file) {
        var _a, _b, _c, _d, _e, _f, _g;
        const artboards = [];
        try {
            if (!this._isFn(file, "artboardCount") || !this._isFn(file, "artboardByIndex")) {
                console.log("GetArtboards: No artboardCount/artboardByIndex on file.");
                return artboards;
            }
            const count = file.artboardCount();
            for (let i = 0; i < count; i++) {
                const ab = file.artboardByIndex(i);
                if (ab) {
                    artboards.push({
                        index: i,
                        name: (_a = ab.name) !== null && _a !== void 0 ? _a : `(artboard-${i})`,
                        width: (_b = ab.width) !== null && _b !== void 0 ? _b : 0,
                        height: (_c = ab.height) !== null && _c !== void 0 ? _c : 0,
                        animationCount: (_e = (_d = ab.animationCount) === null || _d === void 0 ? void 0 : _d.call(ab)) !== null && _e !== void 0 ? _e : 0,
                        stateMachineCount: (_g = (_f = ab.stateMachineCount) === null || _f === void 0 ? void 0 : _f.call(ab)) !== null && _g !== void 0 ? _g : 0,
                    });
                }
            }
        }
        catch (e) {
            console.log("GetArtboards error:", e);
        }
        return artboards;
    }
    /**
     * Dump all artboards in a RiveFile to the console.
     */
    static DumpArtboards(file) {
        console.log("");
        console.log("🎨 ============== RIVE ARTBOARDS ==============");
        const artboards = this.GetArtboards(file);
        console.log(`📦 File has ${artboards.length} artboard(s):`);
        for (const ab of artboards) {
            console.log(`  [${ab.index}] "${ab.name}" - ${ab.width}x${ab.height} (${ab.animationCount} anims, ${ab.stateMachineCount} SMs)`);
        }
        console.log("===============================================");
    }
    /**
     * Attempt to enumerate nested artboard instances within a parent artboard.
     * This looks for any nested artboard references accessible via the Rive API.
     * Note: The Rive web runtime has limited support for this - results may vary.
     */
    static DumpNestedArtboards(artboard) {
        var _a, _b;
        console.log("");
        console.log(`🔍 ============== NESTED ARTBOARDS in "${artboard === null || artboard === void 0 ? void 0 : artboard.name}" ==============`);
        try {
            // Check for objects/nodes
            // Note: Rive WASM doesn't expose a direct "enumerate children" API
            // We can only access nodes by name if we know them in advance
            // This is a limitation of the runtime
            // Try to get some info about the artboard structure
            const ab = artboard;
            // Try some common API patterns that might exist
            if (this._isFn(ab, "objectCount")) {
                console.log(`  objectCount: ${ab.objectCount()}`);
            }
            if (this._isFn(ab, "nestedArtboardCount")) {
                const count = ab.nestedArtboardCount();
                console.log(`  nestedArtboardCount: ${count}`);
                for (let i = 0; i < count; i++) {
                    const nested = (_a = ab.nestedArtboardByIndex) === null || _a === void 0 ? void 0 : _a.call(ab, i);
                    if (nested) {
                        console.log(`    [${i}] ${(_b = nested.name) !== null && _b !== void 0 ? _b : "(unnamed)"}`);
                    }
                }
            }
            else {
                console.log("  ⚠️ No nestedArtboardCount API available.");
                console.log("  💡 Tip: Open the .riv file in Rive Editor to see component names,");
                console.log("     then use artboard.node('nodeName') to access specific nodes.");
            }
            // Try to dump what methods exist on the artboard for exploration
            console.log("  📋 Available artboard methods (for exploration):");
            const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(ab))
                .filter(m => typeof ab[m] === "function" && !m.startsWith("_"))
                .slice(0, 20); // Limit output
            console.log(`    ${methods.join(", ")}`);
        }
        catch (e) {
            console.log("DumpNestedArtboards error:", e);
        }
        console.log("==============================================================");
    }
    /** Try to discover enum name→index mapping even if the property lacks .options. */
    static ProbeEnumIndexMap(vmi, propName, maxCandidates = 16) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const map = {};
        try {
            const enumAccessor = (_b = (_a = vmi).enum) === null || _b === void 0 ? void 0 : _b.call(_a, propName);
            if (!enumAccessor)
                return map;
            // Remember the current name to restore later
            const originalName = enumAccessor.value;
            // Try indices 0..maxCandidates-1; build mapping from name → index
            for (let i = 0; i < maxCandidates; i++) {
                try {
                    // Prefer numeric setter at the VMI level so SMs see the index
                    if (typeof vmi.setPropertyValue === "function") {
                        vmi.setPropertyValue(propName, i);
                    }
                    else if (typeof vmi.set === "function") {
                        vmi.set(propName, i);
                    }
                    else {
                        // last resort: write through the enum accessor if it accepts numbers
                        enumAccessor.value = i;
                    }
                    (_d = (_c = vmi).commit) === null || _d === void 0 ? void 0 : _d.call(_c);
                    const nameNow = (_g = (_f = (_e = vmi).enum) === null || _f === void 0 ? void 0 : _f.call(_e, propName)) === null || _g === void 0 ? void 0 : _g.value;
                    if (typeof nameNow === "string") {
                        // stop if we looped back to the first discovered name
                        if (nameNow in map && map[nameNow] !== i)
                            break;
                        map[nameNow] = i;
                    }
                    else {
                        // if runtime stops changing, we’re done
                        break;
                    }
                }
                catch (_m) {
                    break;
                }
            }
            // restore original name if we had one
            if (originalName !== undefined) {
                if (typeof vmi.setPropertyValue === "function") {
                    vmi.setPropertyValue(propName, (_h = map[originalName]) !== null && _h !== void 0 ? _h : originalName);
                }
                else if (typeof vmi.set === "function") {
                    vmi.set(propName, (_j = map[originalName]) !== null && _j !== void 0 ? _j : originalName);
                }
                else {
                    enumAccessor.value = originalName;
                }
                (_l = (_k = vmi).commit) === null || _l === void 0 ? void 0 : _l.call(_k);
            }
        }
        catch (_o) { }
        return map;
    }
    /** Name or index → index, with probe fallback. */
    static ResolveEnumIndex(vmi, propName, option) {
        var _a, _b, _c, _d, _e, _f;
        if (typeof option === "number")
            return option;
        // try metadata first
        const props = (_c = (_b = (_a = vmi).getProperties) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : [];
        const p = props.find((pp) => (pp === null || pp === void 0 ? void 0 : pp.name) === propName);
        let raw;
        if (Array.isArray(p === null || p === void 0 ? void 0 : p.options))
            raw = p.options;
        else if (typeof (p === null || p === void 0 ? void 0 : p.options) === "function")
            raw = p.options();
        if (raw && raw.length) {
            for (let i = 0; i < raw.length; i++) {
                const o = raw[i];
                const name = typeof o === "string" ? o : ((_d = o === null || o === void 0 ? void 0 : o.name) !== null && _d !== void 0 ? _d : String(i));
                if (name.toUpperCase() === option.toUpperCase())
                    return (typeof o === "number" ? o : ((_e = o === null || o === void 0 ? void 0 : o.value) !== null && _e !== void 0 ? _e : i));
            }
        }
        // no options: probe
        const map = this.ProbeEnumIndexMap(vmi, propName);
        return (_f = map[option]) !== null && _f !== void 0 ? _f : (/^\d+$/.test(option) ? parseInt(option, 10) : undefined);
    }
    static HexToRgb(hex, alpha = 255) {
        if (!hex)
            return null;
        hex = hex.trim().replace(/^#/, '');
        if (/^0x/i.test(hex))
            hex = hex.slice(2); // allow 0xRRGGBB[AA]
        // Expand shorthand #RGB -> #RRGGBB and #RGBA -> #RRGGBBAA
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join(''); // RGB -> RRGGBB
        }
        else if (hex.length === 4) {
            hex = hex.split('').map(c => c + c).join(''); // RGBA -> RRGGBBAA
        }
        let r = 0, g = 0, b = 0, a = alpha;
        if (hex.length === 6) {
            r = parseInt(hex.slice(0, 2), 16);
            g = parseInt(hex.slice(2, 4), 16);
            b = parseInt(hex.slice(4, 6), 16);
            // no alpha in hex -> use param 'alpha' (already set)
        }
        else if (hex.length === 8) {
            r = parseInt(hex.slice(0, 2), 16);
            g = parseInt(hex.slice(2, 4), 16);
            b = parseInt(hex.slice(4, 6), 16);
            a = parseInt(hex.slice(6, 8), 16); // 00..FF -> 0..255
        }
        else {
            return null; // invalid hex length
        }
        // Clamp just in case
        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));
        a = Math.max(0, Math.min(255, a));
        return { r, g, b, a };
    }
    static HexToArgb(hex, alpha = 255) {
        var _a, _b, _c, _d;
        const c = this.HexToRgb(hex, alpha);
        // Fallback to opaque white if invalid input
        const r = (_a = c === null || c === void 0 ? void 0 : c.r) !== null && _a !== void 0 ? _a : 255;
        const g = (_b = c === null || c === void 0 ? void 0 : c.g) !== null && _b !== void 0 ? _b : 255;
        const b = (_c = c === null || c === void 0 ? void 0 : c.b) !== null && _c !== void 0 ? _c : 255;
        const a = (_d = c === null || c === void 0 ? void 0 : c.a) !== null && _d !== void 0 ? _d : 255;
        return [a, r, g, b];
    }
    static GetUniqueColor(index) {
        if (this.ColorPalette[index])
            return this.ColorPalette[index];
        const hue = Math.floor((360 / 50) * (index - 28)); // rotate hue for fallback
        return `hsl(${hue}, 70%, 50%)`;
    }
    static IsObjectIdLike(obj) {
        return obj && typeof obj === "object" && obj.buffer;
    }
    static ToObjectIdString(maybeId) {
        if (typeof maybeId === "string")
            return maybeId;
        if (this.IsObjectIdLike(maybeId)) {
            const buffer = Object.values(maybeId.buffer);
            return buffer.map(b => b.toString(16).padStart(2, "0")).join("");
        }
        return "";
    }
}
RivePakUtils._typename = (x) => Object.prototype.toString.call(x).slice(8, -1);
RivePakUtils._isFn = (o, k) => o && typeof o[k] === "function";
RivePakUtils._debug = false;
RivePakUtils.ColorPalette = {
    0: '#ff7300',
    1: '#8884d8',
    2: '#82ca9d',
    3: '#0088FE',
    4: '#ffe119',
    5: '#FF8042',
    6: '#e6194b',
    7: '#ffbb28',
    8: '#3cb44b',
    9: '#00C49F',
    10: '#4363d8',
    11: '#f58231',
    12: '#911eb4',
    13: '#46f0f0',
    14: '#f032e6',
    15: '#bcf60c',
    16: '#fabebe',
    17: '#008080',
    18: '#e6beff',
    19: '#9a6324',
    20: '#fffac8',
    21: '#800000',
    22: '#aaffc3',
    23: '#808000',
    24: '#ffd8b1',
    25: '#000075',
    26: '#808080',
    27: '#000000'
};
export default RivePakUtils;
