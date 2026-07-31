import { defineConfig, devices } from '@playwright/test';

/*
 * Funksjonell e2e for eksempelappen. Speiler Storybooks oppsett: appen bygges på
 * host (`vite build` → `dist/`), repoet mountes inn i den pinnede Playwright-
 * Docker-imagen (se Dockerfile + docker-compose.yml), og testene serverer den
 * ferdigbygde appen med `vite preview` (respekterer base `/eksempel/`).
 *
 * Til forskjell fra Storybooks visuelle snapshot-jobb er dette funksjonell
 * interaksjonstesting med assertions — kun chromium, ingen pikselsnapshots.
 */
const PORT = 4173;

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 2 : undefined,
    reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
    use: {
        baseURL: `http://localhost:${PORT}/eksempel/`,
        trace: 'on-first-retry',
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
    webServer: {
        // Serverer den ferdigbygde appen (dist/). Bygg på host først (npm run build).
        command: `npx vite preview --port ${PORT} --strictPort`,
        url: `http://localhost:${PORT}/eksempel/`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
    },
});
