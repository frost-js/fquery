import { setTextTests, setup } from '#cases/attributes/attributes/set-text.js';
import { expect, test } from '#test';

test.describe('QuerySet #setText', () => {
    test.beforeEach(setup);

    setTextTests(() => (nodes, ...args) => {
        $(nodes).setText(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        const isSameQuerySet = await page.evaluate(() => {
            const query = $('div');

            return query === query.setText('Test 2');
        });

        expect(isSameQuerySet).toBe(true);
    });
});
