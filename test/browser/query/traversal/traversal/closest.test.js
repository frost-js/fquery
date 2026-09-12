import { closestTests, setup } from '#cases/traversal/traversal/closest.js';
import { expect, test } from '#test';

test.describe('QuerySet #closest', () => {
    test.beforeEach(setup);

    closestTests(([nodes, ...args]) => $(nodes).closest(...args).get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('a');
            const query2 = query1.closest();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('QuerySet inputs', () => {
        test('works with QuerySet filter', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const query = $('div');

                return $('a').closest(query).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'child1',
                'child2',
            ]);
        });

        test('works with QuerySet limit', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const query = $('#span2');

                return $('a').closest('div', query).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'child1',
            ]);
        });
    });
});
