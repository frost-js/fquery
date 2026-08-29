import process from 'node:process';
import { test as base, expect } from '@playwright/test';
import { addCoverageReport } from 'monocart-reporter';

let test = base;

if (process.env.FQUERY_COVERAGE === 'true') {
    test = base.extend({
        coverage: [
            async ({ page }, use, testInfo) => {
                await page.coverage.startJSCoverage({
                    resetOnNavigation: false,
                });

                await use();

                const coverage = await page.coverage.stopJSCoverage();

                if (coverage.length) {
                    await addCoverageReport(coverage, testInfo);
                }
            },
            {
                auto: true,
                scope: 'test',
            },
        ],
    });
}

export { expect, test };
