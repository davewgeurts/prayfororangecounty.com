import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { config } from '../config.js';
import './ShareButtons.css';
export const ShareButtons = ({ date, punchline, siteUrl, siteName, quoteAuthorFallback, sharePrefix, shareText, emailSubject, }) => {
    const [copied, setCopied] = useState(false);
    const resolvedSiteUrl = siteUrl || config.siteUrl;
    const url = `${resolvedSiteUrl}/${date}`;
    const resolvedPrefix = sharePrefix
        || (siteName ? `Today's share from ${siteName}` : `Today's therapy session from the ${quoteAuthorFallback || 'Feline Therapist'}`);
    const text = shareText || `${resolvedPrefix}: "${punchline}"`;
    const resolvedSubject = emailSubject
        || (siteName ? `Check out ${siteName}` : 'Check out this bald cat therapist');
    const share = (platform) => {
        const encoded = encodeURIComponent(url);
        const encodedText = encodeURIComponent(text);
        const urls = {
            twitter: `https://x.com/intent/tweet?url=${encoded}&text=${encodedText}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
            reddit: `https://reddit.com/submit?url=${encoded}&title=${encodedText}`,
            email: `mailto:?subject=${encodeURIComponent(resolvedSubject)}&body=${encodedText}%0A%0A${encoded}`,
        };
        window.open(urls[platform], '_blank', 'noopener,noreferrer');
    };
    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        catch {
            // Clipboard API unavailable
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("button", { className: "share-btn twitter", onClick: () => share('twitter'), "aria-label": "Share on X", children: _jsx("span", { className: "share-icon", children: "\uD835\uDD4F" }) }), _jsx("button", { className: "share-btn facebook", onClick: () => share('facebook'), "aria-label": "Share on Facebook", children: _jsx("span", { className: "share-icon", children: "f" }) }), _jsx("button", { className: "share-btn reddit", onClick: () => share('reddit'), "aria-label": "Share on Reddit", children: _jsx("span", { className: "share-icon", children: "r/" }) }), _jsx("button", { className: "share-btn email", onClick: () => share('email'), "aria-label": "Share via email", children: _jsx("span", { className: "share-icon", children: "\u2709" }) }), _jsx("button", { className: "share-btn copy", onClick: copyLink, "aria-label": "Copy link", children: _jsx("span", { className: "share-icon", children: copied ? '✓' : '🔗' }) })] }));
};
