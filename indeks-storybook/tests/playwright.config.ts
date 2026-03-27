import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: '.',
    testMatch: '**/*dtest*',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 0 : 0,
    workers: process.env.CI ? 4 : undefined,
    reporter: 'html',
    maxFailures: 5,
    use: {
        trace: 'on-first-retry',
    },

    webServer: {
        command: 'python3 -m http.server 9009 --directory ../storybook-static',
        url: 'http://localhost:9009',
        reuseExistingServer: true,
        timeout: 30 * 1000,
    },

    projects: [
        // Mobil
        {
            name: 'mobile-chromium',
            use: { ...devices['Galaxy S24'] },
        },
        {
            name: 'mobile-webkit',
            use: { ...devices['iPhone 15'] },
        },
        // Desktop
        {
            name: 'desktop-chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'desktop-firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'desktop-webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
});
