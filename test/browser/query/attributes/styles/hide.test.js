import { hideTests, setup } from '#cases/attributes/styles/hide.js';
import { expect, test } from '#test';

test.describe('QuerySet #hide', () => {
    test.beforeEach(setup);

    hideTests(() => (nodes) => {
        $(nodes).hide();
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate(() => {
            const query = $('div');
            return query === query.hide();
        })).toBe(true);
    });
});
