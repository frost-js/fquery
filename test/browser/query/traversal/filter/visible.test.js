import { setup, visibleTests } from '#cases/traversal/filter/visible.js';
import { expect, test } from '#test';

test.describe('QuerySet #visible', () => {
    test.beforeEach(setup);

    visibleTests((nodes) => $(nodes).visible().get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const query1 = $('div');
            const query2 = query1.visible();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with Document nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $(document).visible().get().map((node) => node.id));

        expect(ids).toEqual([
            'document',
        ]);
    });

    test('works with Window nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $(window).visible().get().map((node) => node.id));

        expect(ids).toEqual([
            'window',
        ]);
    });
});
