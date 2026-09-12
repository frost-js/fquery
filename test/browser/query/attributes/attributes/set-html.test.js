import { setHtmlTests, setup } from '#cases/attributes/attributes/set-html.js';
import { expect, test } from '#test';

test.describe('QuerySet #setHtml', () => {
    test.beforeEach(setup);

    setHtmlTests(() => (nodes, ...args) => {
        $(nodes).setHtml(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        const isSameQuerySet = await page.evaluate(() => {
            const query = $('div');

            return query === query.setHtml('<span>Test 2</span>');
        });

        expect(isSameQuerySet).toBe(true);
    });
});
