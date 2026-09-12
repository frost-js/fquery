import { setScrollXTests, setup } from '#cases/attributes/scroll/set-scroll-x.js';
import { expect, test } from '#test';

test.describe('QuerySet #setScrollX', () => {
    test.beforeEach(setup);

    setScrollXTests(([nodes, ...args]) => $(nodes).setScrollX(...args));

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.setScrollX(100);
        })).toBe(true);
    });
});
