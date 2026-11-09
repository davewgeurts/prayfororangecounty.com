import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { config } from '../config.js';
import './PromptReveal.css';
export const PromptReveal = ({ imagePrompt } = {}) => {
    const [open, setOpen] = useState(false);
    const promptText = imagePrompt ?? config.imagePrompt;
    if (!promptText)
        return null;
    return (_jsxs("div", { className: "prompt-reveal", children: [_jsx("button", { className: "prompt-toggle", onClick: () => setOpen(!open), children: open ? 'Hide prompt' : 'Hey friend, here\'s the AI prompt used to create these images' }), open && (_jsx("div", { className: "prompt-content", children: _jsx("p", { children: promptText }) }))] }));
};
