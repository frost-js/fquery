import { expect, test } from '#test';

test.describe('#createRange', () => {
    test('creates a new range', async ({ page }) => {
        const isRange = await page.evaluate(() => $.createRange() instanceof Range);

        expect(isRange).toBe(true);
    });
});
