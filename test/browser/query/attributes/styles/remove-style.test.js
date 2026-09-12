import { removeStyleTests, setup } from '#cases/attributes/styles/remove-style.js';
import { expect, test } from '#test';

test.describe('QuerySet #removeStyle', () => {
    test.beforeEach(setup);

    removeStyleTests(([nodes, ...args]) => {
        $(nodes).removeStyle(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.removeStyle('color');
        })).toBe(true);
    });
});
