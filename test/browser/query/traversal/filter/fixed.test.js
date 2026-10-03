import { fixedTests, setup } from '#cases/traversal/filter/fixed.js';
import { expect, test } from '#test';

test.describe('QuerySet #fixed', () => {
    test.beforeEach(setup);

    fixedTests((nodes) => $(nodes).fixed().get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const query1 = $('div');
            const query2 = query1.fixed();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });
});
