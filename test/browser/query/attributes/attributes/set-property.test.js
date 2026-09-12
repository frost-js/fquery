import { setPropertyTests, setup } from '#cases/attributes/attributes/set-property.js';
import { expect, test } from '#test';

test.describe('QuerySet #setProperty', () => {
    test.beforeEach(setup);

    setPropertyTests(([nodes, ...args]) => {
        $(nodes).setProperty(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('input');
            return query === query.setProperty('test', 'Test');
        })).toBe(true);
    });
});
