import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught:', error, info.componentStack);
    }
    render() {
        if (this.state.hasError) {
            return (_jsxs("div", { style: {
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    textAlign: 'center',
                }, children: [_jsx("h1", { style: { fontSize: '1.5rem', marginBottom: '1rem' }, children: "The therapist stepped out for a moment" }), _jsx("p", { style: { color: '#888', marginBottom: '1.5rem' }, children: "Something went wrong. Try refreshing the page." }), _jsx("button", { onClick: () => window.location.reload(), style: {
                            padding: '0.6rem 1.5rem',
                            borderRadius: '8px',
                            border: '1px solid #444',
                            background: '#1e1e1e',
                            color: '#e8e8e8',
                            cursor: 'pointer',
                            fontSize: '1rem',
                        }, children: "Refresh" })] }));
        }
        return this.props.children;
    }
}
