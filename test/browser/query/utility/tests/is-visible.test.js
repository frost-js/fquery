import { isVisibleTests, setup } from '#cases/utility/tests/is-visible.js';
import { expect, test } from '#test';

test.describe('QuerySet #isVisible', () => {
    test.beforeEach(setup);

    isVisibleTests((nodes) => $(nodes).isVisible());

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $(document).isVisible())).toBe(true);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $(window).isVisible())).toBe(true);
    });
});
