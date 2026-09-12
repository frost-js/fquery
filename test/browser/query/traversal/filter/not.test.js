import { notTests, setup } from '#cases/traversal/filter/not.js';
import { expect, test } from '#test';

test.describe('QuerySet #not', () => {
    test.beforeEach(setup);

    test.describe('filter inputs', () => {
        notTests(([nodes, filter]) => $(nodes).not(filter).get().map((node) => node.id));

        test('works with QuerySet filter', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const query = $('[data-filter="test"]');

                return $('div').not(query).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'div2',
                'div4',
            ]);
        });
    });

    test('returns nodes not matching a filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').not('[data-filter="test"]').get().map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.not('[data-filter="test"]');

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('node inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const fragment = document.createDocumentFragment();
                fragment.id = 'fragment';

                return $(fragment).not('[data-filter="test"]').get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'fragment',
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                shadow.id = 'shadow';

                return $(shadow).not('[data-filter="test"]').get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'shadow',
            ]);
        });
    });
});
