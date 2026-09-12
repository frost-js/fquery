import { notOneTests, setup } from '#cases/traversal/filter/not-one.js';
import { expect, test } from '#test';

test.describe('QuerySet #notOne', () => {
    test.beforeEach(setup);

    test.describe('filter inputs', () => {
        notOneTests(([nodes, filter]) => $(nodes).notOne(filter).get().map((node) => node.id));

        test('works with QuerySet filter', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const query = $('[data-filter="test"]');

                return $('div').notOne(query).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'div2',
            ]);
        });

        test('works with HTMLCollection filter', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $('div').notOne(document.body.children).get().map((node) => node.id));

            expect(ids).toEqual([]);
        });

        test('works with DocumentFragment filter', async ({ page }) => {
            const nodes = await page.evaluate((_) => {
                const fragment = document.createDocumentFragment();
                fragment.id = 'fragment';

                return $([fragment]).notOne(fragment).get();
            });

            expect(nodes).toEqual([]);
        });

        test('works with ShadowRoot filter', async ({ page }) => {
            const nodes = await page.evaluate((_) => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                shadow.id = 'shadow';

                return $([shadow]).notOne(shadow).get();
            });

            expect(nodes).toEqual([]);
        });
    });

    test('returns the first node not matching a filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $('div').notOne('[data-filter="test"]').get().map((node) => node.id));

        expect(ids).toEqual([
            'div2',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.notOne('[data-filter="test"]');

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('node inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const fragment = document.createDocumentFragment();
                fragment.id = 'fragment';

                return $(fragment).notOne('[data-filter="test"]').get().map((node) => node.id);
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

                return $(shadow).notOne('[data-filter="test"]').get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'shadow',
            ]);
        });
    });
});
