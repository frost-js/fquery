import { defineConfig } from '@playwright/test';

export default defineConfig({
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium' },
        },
        {
            name: 'firefox',
            use: { browserName: 'firefox' },
        },
        {
            name: 'webkit',
            use: { browserName: 'webkit' },
        },
    ],
    testDir: './test/browser',
    testMatch: '**/*.test.js',
    timeout: 30000,
    use: {
        baseURL: 'http://localhost:3001',
        headless: true,
        viewport: {
            height: 600,
            width: 800,
        },
    },
    webServer: {
        command: 'node test/support/server/static-server.js',
        reuseExistingServer: !process.env.CI,
        url: 'http://localhost:3001',
    },
});
