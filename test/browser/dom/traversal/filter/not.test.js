import { notTests, setup } from '#cases/traversal/filter/not.js';
import { expect, test } from '#test';

test.describe('#not', () => {
    test.beforeEach(setup);

    test.describe('filter inputs', () => {
        notTests((args) => $.not(...args).map((node) => node.id));
    });

    test('returns nodes not matching a filter', async ({ page }) => {
        const ids = await page.evaluate(() =>
            $.not('div', '[data-filter="test"]').map((node) => node.id));

        expect(ids).toEqual([
            'div2',
            'div4',
        ]);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.not(document.getElementById('div2'), '[data-filter="test"]').map((node) => node.id));

            expect(ids).toEqual([
                'div2',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.not(document.querySelectorAll('div'), '[data-filter="test"]').map((node) => node.id));

            expect(ids).toEqual([
                'div2',
                'div4',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.not(document.body.children, '[data-filter="test"]').map((node) => node.id));

            expect(ids).toEqual([
                'div2',
                'div4',
            ]);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const fragment = document.createDocumentFragment();
                fragment.id = 'fragment';

                return $.not(fragment, '[data-filter="test"]').map((node) => node.id);
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

                return $.not(shadow, '[data-filter="test"]').map((node) => node.id);
            });

            expect(ids).toEqual([
                'shadow',
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.not([
                    document.getElementById('div1'),
                    document.getElementById('div2'),
                    document.getElementById('div3'),
                    document.getElementById('div4'),
                ], '[data-filter="test"]').map((node) => node.id));

            expect(ids).toEqual([
                'div2',
                'div4',
            ]);
        });
    });
});
