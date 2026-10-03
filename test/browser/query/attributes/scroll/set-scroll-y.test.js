import { setScrollYTests, setup } from '#cases/attributes/scroll/set-scroll-y.js';
import { expect, test } from '#test';

test.describe('QuerySet #setScrollY', () => {
    test.beforeEach(setup);

    setScrollYTests(([nodes, ...args]) => $(nodes).setScrollY(...args));

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate(() => {
            const query = $('div');
            return query === query.setScrollY(100);
        })).toBe(true);
    });
});
