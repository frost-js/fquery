import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#createRange', () => {
    test('creates a new range', async ({ page }) => {
        const isRange = await page.evaluate(() => $.createRange() instanceof Range);

        expect(isRange).toBe(true);
    });
});
