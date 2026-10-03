import { setup, siblingsTests } from '#cases/traversal/traversal/siblings.js';
import { expect, test } from '#test';

test.describe('QuerySet #siblings', () => {
    test.beforeEach(setup);

    siblingsTests(([nodes, ...args]) => $(nodes).siblings(...args).get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const query1 = $('.span');
            const query2 = query1.siblings();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('QuerySet inputs', () => {
        test('works with QuerySet filter', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const query = $('#span1, #span10');

                return $('.span').siblings(query).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'span1',
                'span10',
            ]);
        });
    });
});
