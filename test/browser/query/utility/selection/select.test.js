import { selectTests, setup } from '#cases/utility/selection/select.js';
import { expect, test } from '#test';

test.describe('QuerySet #select', () => {
    test.beforeEach(setup);

    selectTests(() => (nodes) => {
        $(nodes).select();
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate(() => {
            const query = $('.select');
            return query === query.select();
        })).toBe(true);
    });
});
