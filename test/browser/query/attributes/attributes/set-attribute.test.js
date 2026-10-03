import { setAttributeTests, setup } from '#cases/attributes/attributes/set-attribute.js';
import { expect, test } from '#test';

test.describe('QuerySet #setAttribute', () => {
    test.beforeEach(setup);

    setAttributeTests(([nodes, ...args]) => {
        $(nodes).setAttribute(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        const isSameQuerySet = await page.evaluate(() => {
            const query = $('input');

            return query === query.setAttribute('placeholder', '123');
        });

        expect(isSameQuerySet).toBe(true);
    });
});
