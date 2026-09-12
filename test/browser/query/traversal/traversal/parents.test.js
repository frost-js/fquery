import { parentsTests, setup } from '#cases/traversal/traversal/parents.js';
import { expect, test } from '#test';

test.describe('QuerySet #parents', () => {
    test.beforeEach(setup);

    parentsTests(([nodes, ...args]) => $(nodes).parents(...args).get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('a');
            const query2 = query1.parents();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('QuerySet inputs', () => {
        test('works with QuerySet filter', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const query = $('div');

                return $('a').parents(query).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'parent1',
                'child1',
                'parent2',
                'child2',
            ]);
        });

        test('works with QuerySet limit', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const query = $('div');

                return $('a').parents(null, query).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'span1',
                'span2',
            ]);
        });
    });
});
