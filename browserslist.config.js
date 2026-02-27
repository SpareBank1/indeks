/**
 * Delte nettleser-targets for hele monorepoet.
 * Brukes av både browserslist (PostCSS/Autoprefixer) og Vite/esbuild.
 */

// Browserslist-format (for PostCSS, Autoprefixer, etc.)
export const browserslist = ['last 3 years', 'Edge >= 99', 'Firefox >= 97', 'Chrome >= 99', 'Safari >= 15.4'];

// Esbuild-format (for Vite build.target)
export const esbuildTargets = ['edge99', 'firefox97', 'chrome99', 'safari15.4'];

// For CommonJS-kompatibilitet med browserslist CLI
export default browserslist;
