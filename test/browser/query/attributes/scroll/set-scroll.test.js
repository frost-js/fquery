import { setScrollTests, setup } from '#cases/attributes/scroll/set-scroll.js';
import { expect, test } from '#test';

test.describe('QuerySet #setScroll', () => {
    test.beforeEach(setup);

    setScrollTests(([nodes, ...args]) => $(nodes).setScroll(...args));

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.setScroll(100, 50);
        })).toBe(true);
    });
});
