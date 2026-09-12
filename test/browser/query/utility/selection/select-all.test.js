import { selectAllTests, setup } from '#cases/utility/selection/select-all.js';
import { expect, test } from '#test';

test.describe('QuerySet #selectAll', () => {
    test.beforeEach(setup);

    selectAllTests(([nodes, ...args]) => {
        $(nodes).selectAll(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('.select');
            return query === query.selectAll();
        })).toBe(true);
    });
});
