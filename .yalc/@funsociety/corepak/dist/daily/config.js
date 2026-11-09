const metaEnv = typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : {};
const globalBuildId = typeof globalThis !== 'undefined' && '__BUILD_ID__' in globalThis
    ? String(globalThis.__BUILD_ID__)
    : 'dev';
export const config = {
    siteUrl: metaEnv.VITE_SITE_URL || 'http://127.0.0.1:81',
    viewsApiUrl: metaEnv.VITE_VIEWS_API_URL || '',
    imagePrompt: metaEnv.VITE_IMAGE_PROMPT || '',
    buildId: globalBuildId,
    debug: metaEnv.VITE_DEBUG === 'true',
    isProd: Boolean(metaEnv.PROD),
    isDev: metaEnv.DEV !== undefined ? Boolean(metaEnv.DEV) : false,
    countdownLabel: 'Next session in',
};
export function configureDaily(overrides) {
    Object.assign(config, overrides);
    return config;
}
