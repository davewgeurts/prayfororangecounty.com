import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
interface Props {
    children: ReactNode;
}
interface State {
    hasError: boolean;
}
export declare class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props);
    static getDerivedStateFromError(): State;
    componentDidCatch(error: Error, info: ErrorInfo): void;
    render(): ReactNode;
}
export {};
