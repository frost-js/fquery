import { removeClassTests, setup } from '#cases/attributes/styles/remove-class.js';
import { expect, test } from '#test';

test.describe('QuerySet #removeClass', () => {
    test.beforeEach(setup);

    removeClassTests(([nodes, ...args]) => {
        $(nodes).removeClass(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate(() => {
            const query = $('div');
            return query === query.removeClass('test1');
        })).toBe(true);
    });
});
