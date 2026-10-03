import { addClassTests, setup } from '#cases/attributes/styles/add-class.js';
import { expect, test } from '#test';

test.describe('QuerySet #addClass', () => {
    test.beforeEach(setup);

    addClassTests(([nodes, ...args]) => {
        $(nodes).addClass(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate(() => {
            const query = $('div');
            return query === query.addClass('test');
        })).toBe(true);
    });
});
