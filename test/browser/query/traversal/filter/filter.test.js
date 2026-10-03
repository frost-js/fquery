import { filterTests, setup } from '#cases/traversal/filter/filter.js';
import { expect, test } from '#test';

test.describe('QuerySet #filter', () => {
    test.beforeEach(setup);

    test.describe('filter inputs', () => {
        filterTests(([nodes, filter]) => $(nodes).filter(filter).get().map((node) => node.id));

        test('works with QuerySet filter', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const query = $('[data-filter="test"]');

                return $('div').filter(query).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'div2',
                'div4',
            ]);
        });
    });

    test('returns filtered nodes', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $('div').filter('[data-filter="test"]').get().map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const query1 = $('div');
            const query2 = query1.filter('[data-filter="test"]');

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('node inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const fragment = document.createDocumentFragment();
                fragment.id = 'fragment';

                return $(fragment).filter().get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'fragment',
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                shadow.id = 'shadow';

                return $(shadow).filter().get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'shadow',
            ]);
        });
    });
});
