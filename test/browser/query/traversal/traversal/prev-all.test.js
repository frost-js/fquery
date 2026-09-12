import { prevAllTests, setup } from '#cases/traversal/traversal/prev-all.js';
import { expect, test } from '#test';

test.describe('QuerySet #prevAll', () => {
    test.beforeEach(setup);

    prevAllTests(([nodes, ...args]) => $(nodes).prevAll(...args).get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('.span');
            const query2 = query1.prevAll();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('QuerySet inputs', () => {
        test('works with QuerySet filter', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const query = $('#span1, #span5');

                return $('.span').prevAll(query).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'span1',
                'span5',
            ]);
        });

        test('works with QuerySet limit', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const query = $('#span1, #span6');

                return $('.span').prevAll(null, query).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'span2',
            ]);
        });
    });
});
