import { setup, withDataTests } from '#cases/traversal/filter/with-data.js';
import { expect, test } from '#test';

test.describe('QuerySet #withData', () => {
    test.beforeEach(setup);

    withDataTests(([nodes, ...args]) => $(nodes).withData(...args).get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        const isNewQuerySet = await page.evaluate(() => {
            const query1 = $('div');
            const query2 = query1.withData();

            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        });

        expect(isNewQuerySet).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        const ids = await page.evaluate(() => {
            const fragment = document.createDocumentFragment();

            $.setData(fragment, 'test', 'Test');
            fragment.id = 'fragment';

            return $(fragment).withData().get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'fragment',
        ]);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        const ids = await page.evaluate(() => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });

            $.setData(shadow, 'test', 'Test');
            shadow.id = 'shadow';

            return $(shadow).withData().get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'shadow',
        ]);
    });

    test('works with Document nodes', async ({ page }) => {
        const ids = await page.evaluate(() => {
            $.setData(document, 'test', 'Test');

            return $(document).withData().get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'document',
        ]);
    });

    test('works with Window nodes', async ({ page }) => {
        const ids = await page.evaluate(() => {
            $.setData(window, 'test', 'Test');

            return $(window).withData().get().map((node) => node.id);
        });

        expect(ids).toEqual([
            'window',
        ]);
    });
});
