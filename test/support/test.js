import process from 'node:process';
import { test as base, expect } from '@playwright/test';
import { addCoverageReport } from 'monocart-reporter';
import { setupClock } from '../setup/browser.js';

const collectCoverage = process.env.FQUERY_COVERAGE === 'true';

const test = base.extend({
    expectedBrowserErrors: [[], { option: true }],
    mockClock: [false, { option: true }],
    fqueryPage: [
        async ({ page, mockClock, expectedBrowserErrors }, use, testInfo) => {
            const errors = [];
            page.on('pageerror', (error) => errors.push(error.message));

            if (collectCoverage) {
                await page.coverage.startJSCoverage({
                    resetOnNavigation: false,
                });
            }

            if (mockClock) {
                await setupClock(page);
            }

            await page.goto('/', {
                waitUntil: 'domcontentloaded',
            });

            await page.evaluate(() => {
                if (!window.fQuery) {
                    throw new Error('Failed to load fQuery on the test page.');
                }

                $.setAjaxDefaults({
                    xhr: () => new window.MockXMLHttpRequest(),
                });
                $.useTimeout();

                document.head.replaceChildren();
                document.body.replaceChildren();
                window.id = 'window';
                document.id = 'document';
            });

            await use();

            if (collectCoverage) {
                const coverage = await page.coverage.stopJSCoverage();
                await addCoverageReport(coverage, testInfo);
            }

            expect(errors, 'Uncaught browser errors').toEqual(expectedBrowserErrors);
        },
        { auto: true },
    ],
});

export { expect, test };
