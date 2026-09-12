import { nextAllTests, setup } from '#cases/traversal/traversal/next-all.js';
import { expect, test } from '#test';

test.describe('QuerySet #nextAll', () => {
    test.beforeEach(setup);

    nextAllTests(([nodes, ...args]) => $(nodes).nextAll(...args).get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('.span');
            const query2 = query1.nextAll();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('QuerySet inputs', () => {
        test('works with QuerySet filter', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const query = $('#span4, #span8');

                return $('.span').nextAll(query).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'span4',
                'span8',
            ]);
        });

        test('works with QuerySet limit', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const query = $('#span4, #span7');

                return $('.span').nextAll(null, query).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'span3',
            ]);
        });
    });
});
