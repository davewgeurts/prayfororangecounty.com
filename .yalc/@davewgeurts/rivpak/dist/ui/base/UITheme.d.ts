/**
 * Theme System for RivePak UI Components
 */
export interface UITheme {
    name: string;
    colors: {
        primary: number;
        primaryLight: number;
        primaryHover: number;
        primaryActive: number;
        secondary: number;
        secondaryHover: number;
        secondaryActive: number;
        background: number;
        surface: number;
        surfaceHover: number;
        text: number;
        textSecondary: number;
        textDisabled: number;
        border: number;
        borderHover: number;
        borderFocus: number;
        disabled: number;
        error: number;
        success: number;
        warning: number;
        info: number;
    };
    fonts: {
        family: string;
        size: number;
        sizeSmall: number;
        sizeLarge: number;
        weight: string;
        weightBold: string;
    };
    spacing: {
        tiny: number;
        small: number;
        medium: number;
        large: number;
        huge: number;
    };
    borderRadius: number;
    borderWidth: number;
    animation: {
        duration: number;
        easing: string;
    };
    shadows: {
        small: {
            color: number;
            alpha: number;
            blur: number;
            offsetX: number;
            offsetY: number;
        };
        medium: {
            color: number;
            alpha: number;
            blur: number;
            offsetX: number;
            offsetY: number;
        };
        large: {
            color: number;
            alpha: number;
            blur: number;
            offsetX: number;
            offsetY: number;
        };
    };
}
export declare const LightTheme: UITheme;
export declare const DarkTheme: UITheme;
export declare class UIThemeManager {
    private static themes;
    private static currentTheme;
    static get Current(): UITheme;
    static SetTheme(name: string): void;
    static RegisterTheme(theme: UITheme): void;
    static GetTheme(name: string): UITheme | undefined;
}
