let explicitEdition = null;
export function setPilgrimageEdition(edition) {
    explicitEdition = edition;
}
export function getPilgrimageEdition() {
    if (explicitEdition)
        return explicitEdition;
    if (typeof window !== 'undefined') {
        const host = (window.location?.hostname || '').toLowerCase();
        const title = (typeof document !== 'undefined' ? document.title || '' : '').toLowerCase();
        if (host.includes('orangecounty') ||
            host.includes('ocean') ||
            title.includes('ocean') ||
            title.includes('trestles') ||
            title.includes('laguna')) {
            return 'orangecounty';
        }
    }
    return 'utah';
}
