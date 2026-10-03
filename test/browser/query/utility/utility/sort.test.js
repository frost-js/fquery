import { setup, sortTests } from '#cases/utility/utility/sort.js';
import { expect, test } from '#test';

test.describe('QuerySet #sort', () => {
    test.beforeEach(setup);

    sortTests((nodes) => $(nodes).sort().get().map((node) => node.id));

    test('returns a new QuerySet', async ({ page }) => {
        expect(await page.evaluate(() => {
            const query1 = $('div');
            const query2 = query1.sort();
            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        })).toEqual(true);
    });

    test.describe('node inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const fragment = document.createDocumentFragment();
                fragment.id = 'fragment';
                return $(fragment)
                        .sort()
                        .get()
                        .map((node) => node.id);
            })).toEqual([
                'fragment',
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                shadow.id = 'shadow';
                return $(shadow)
                        .sort()
                        .get()
                        .map((node) => node.id);
            })).toEqual([
                'shadow',
            ]);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $(document)
                        .sort()
                        .get()
                        .map((node) => node.id))).toEqual([
                'document',
            ]);
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $(window)
                        .sort()
                        .get()
                        .map((node) => node.id))).toEqual([
                'window',
            ]);
        });
    });
});
