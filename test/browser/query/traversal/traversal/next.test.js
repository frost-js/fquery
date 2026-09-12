import { nextTests, setup } from '#cases/traversal/traversal/next.js';
import { expect, test } from '#test';

test.describe('QuerySet #next', () => {
    test.beforeEach(setup);

    nextTests(([nodes, ...args]) => $(nodes).next(...args).get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('.span');
            const query2 = query1.next();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('QuerySet inputs', () => {
        test('works with QuerySet filter', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const query = $('#span7');

                return $('.span').next(query).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'span7',
            ]);
        });
    });
});
