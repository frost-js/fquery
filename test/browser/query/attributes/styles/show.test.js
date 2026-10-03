import { setup, showTests } from '#cases/attributes/styles/show.js';
import { expect, test } from '#test';

test.describe('QuerySet #show', () => {
    test.beforeEach(setup);

    showTests(() => (nodes) => {
        $(nodes).show();
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate(() => {
            const query = $('div');
            return query === query.show();
        })).toBe(true);
    });
});
