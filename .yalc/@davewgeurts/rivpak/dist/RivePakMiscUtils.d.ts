import { File as RiveFile, Artboard, ViewModel, ViewModelInstance } from "@rive-app/webgl2-advanced";
export default class RivePakUtils {
    static myInstance: RivePakUtils;
    static get(): RivePakUtils;
    static _typename: (x: any) => string;
    static _isFn: (o: any, k: string) => any;
    /** Try to read a "value" from different property shapes safely. */
    static _readPropValueSafe(obj: any, key: string): any;
    /** Dump all enums declared in a RiveFile (names + options). */
    static DumpEnums(file: RiveFile): void;
    /** Return best ViewModel match for an artboard. */
    static PickBestViewModel(file: RiveFile, artboard: Artboard, requestedName?: string): ViewModel | null;
    /** Make a VMI with preference order: instanceByName > defaultInstance > instance. */
    static MakeBestVMI(vm: ViewModel, artboard: Artboard, instanceName?: string): ViewModelInstance | null;
    /** Dump one ViewModel’s metadata. */
    static DumpViewModel(vm: ViewModel): void;
    /** Dump a VMI's current property values. */
    static DumpVMI(vmi: ViewModelInstance): void;
    /** Safe enum setter on a VMI (by property + option name). */
    static SetEnumOnVMI(vmi: ViewModelInstance, propName: string, optionName: string): boolean;
    /** High-level: dump everything relevant for a file/artboard/VM/VMI. */
    static DumpRiveDiagnostics(file: RiveFile, artboard: Artboard, vm: ViewModel | null, vmi: ViewModelInstance | null): void;
}
