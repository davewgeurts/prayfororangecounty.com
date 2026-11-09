import { File as RiveFile, Artboard, ViewModel, ViewModelInstance } from "@rive-app/webgl2-advanced";
export interface ArtboardInfo {
    index: number;
    name: string;
    width: number;
    height: number;
    animationCount: number;
    stateMachineCount: number;
}
export default class RivePakUtils {
    static myInstance: RivePakUtils;
    static get(): RivePakUtils;
    static _typename: (x: any) => string;
    static _isFn: (o: any, k: string) => any;
    private static _debug;
    static get debug(): boolean;
    /** Try to read a "value" from different property shapes safely. */
    static _readPropValueSafe(obj: any, key: string): any;
    /** Dump all enums declared in a RiveFile (names + options). */
    static DumpEnums(file: RiveFile): void;
    /** Return best Vie wModel match for an artboard. */
    static PickBestViewModel(file: RiveFile, artboard: Artboard, requestedName?: string): ViewModel | null;
    /** Make a VMI with preference order: instanceByName > defaultInstance > instance. */
    static MakeBestVMI(vm: ViewModel, artboard: Artboard, instanceName?: string): ViewModelInstance | null;
    /** Dump one ViewModel’s metadata. */
    static DumpViewModel(vm: ViewModel): void;
    /** Dump a VMI's current property values. */
    static DumpVMI(vmi: ViewModelInstance): void;
    /** Safe enum setter on a VMI (by property + option name). */
    static SetEnumOnVMI(vmi: ViewModelInstance, propName: string, optionName: string): boolean;
    static GetEnumIndexMap(vmi: ViewModelInstance, propName: string): Record<string, number>;
    static SetEnum(file: RiveFile, artboard: Artboard, propName: string, optionName: string, vmName?: string): boolean;
    /** High-level: dump everything relevant for a file/artboard/VM/VMI. */
    static DumpRiveDiagnostics(file: RiveFile, artboard: Artboard, vm: ViewModel | null, vmi: ViewModelInstance | null): void;
    /**
     * List all artboards in a RiveFile with their info.
     * Returns an array of ArtboardInfo objects.
     */
    static GetArtboards(file: RiveFile): ArtboardInfo[];
    /**
     * Dump all artboards in a RiveFile to the console.
     */
    static DumpArtboards(file: RiveFile): void;
    /**
     * Attempt to enumerate nested artboard instances within a parent artboard.
     * This looks for any nested artboard references accessible via the Rive API.
     * Note: The Rive web runtime has limited support for this - results may vary.
     */
    static DumpNestedArtboards(artboard: Artboard): void;
    /** Try to discover enum name→index mapping even if the property lacks .options. */
    static ProbeEnumIndexMap(vmi: ViewModelInstance, propName: string, maxCandidates?: number): Record<string, number>;
    /** Name or index → index, with probe fallback. */
    static ResolveEnumIndex(vmi: ViewModelInstance, propName: string, option: string | number): number | undefined;
    static HexToRgb(hex: string, alpha?: number): {
        r: number;
        g: number;
        b: number;
        a: number;
    } | null;
    static HexToArgb(hex: string, alpha?: number): [number, number, number, number];
    static GetUniqueColor(index: number): string;
    static IsObjectIdLike(obj: any): boolean;
    static ToObjectIdString(maybeId: any): string;
    static ColorPalette: {
        [key: number]: string;
    };
}
