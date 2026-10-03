import { setup, withDescendentTests } from '#cases/traversal/filter/with-descendent.js';
import { expect, test } from '#test';

test.describe('QuerySet #withDescendent', () => {
    test.beforeEach(setup);

    withDescendentTests(([nodes, ...args]) => $(nodes).withDescendent(...args).get().map((node) => node.id));

    test('returns an empty QuerySet for empty elements without a filter', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $('#div2, #div4').withDescendent().get().map((node) => node.id));

        expect(ids).toEqual([]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const query1 = $('div');
            const query2 = query1.withDescendent('a');

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test.describe('node inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const range = document.createRange();
                const fragment = range.createContextualFragment('<div></div>');
                fragment.id = 'fragment';

                return $(fragment).withDescendent('div').get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'fragment',
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                const range = document.createRange();
                const fragment = range.createContextualFragment('<div></div>');

                shadow.appendChild(fragment);
                shadow.id = 'shadow';

                return $(shadow).withDescendent('div').get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'shadow',
            ]);
        });

        test('works with Document nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $(document).withDescendent('div').get().map((node) => node.id));

            expect(ids).toEqual([
                'document',
            ]);
        });
    });

    test.describe('QuerySet inputs', () => {
        test('works with QuerySet filter', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const query = $('a');

                return $('div').withDescendent(query).get().map((node) => node.id);
            });

            expect(ids).toEqual([
                'div1',
                'div3',
            ]);
        });
    });
});
