import { prevTests, setup } from '#cases/traversal/traversal/prev.js';
import { expect, test } from '#test';

test.describe('QuerySet #prev', () => {
    test.beforeEach(setup);

    prevTests(([nodes, ...args]) => $(nodes).prev(...args).get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('.span');
            const query2 = query1.prev();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('QuerySet inputs', () => {
        test('works with QuerySet filter', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const query = $('#span6');

                return $('.span').prev(query).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'span6',
            ]);
        });
    });
});
