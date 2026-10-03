import { sameTests, setup } from '#cases/traversal/filter/same.js';
import { expect, test } from '#test';

test.describe('QuerySet #same', () => {
    test.beforeEach(setup);

    sameTests(([nodes, ...args]) => $(nodes).same(...args).get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const query1 = $('div');
            const query2 = query1.same('#div2, #div4');

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('source inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const fragment = document.createDocumentFragment();
                fragment.id = 'fragment';

                return $(fragment).same([fragment]).get().map((node) => node.id);
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

                return $(shadow).same([shadow]).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'shadow',
            ]);
        });
    });

    test.describe('QuerySet inputs', () => {
        test('works with QuerySet other nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const query = $('#div2, #div4');

                return $('div').same(query).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'div2',
                'div4',
            ]);
        });
    });
});
