import { sameTests, setup } from '#cases/traversal/filter/same.js';
import { expect, test } from '#test';

test.describe('#same', () => {
    test.beforeEach(setup);

    sameTests((args) => $.same(...args).map((node) => node.id));

    test.describe('source inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.same(document.getElementById('div2'), '#div2, #div4').map((node) => node.id));

            expect(ids).toEqual([
                'div2',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.same(document.querySelectorAll('div'), '#div2, #div4').map((node) => node.id));

            expect(ids).toEqual([
                'div2',
                'div4',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.same(document.body.children, '#div2, #div4').map((node) => node.id));

            expect(ids).toEqual([
                'div2',
                'div4',
            ]);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const fragment = document.createDocumentFragment();
                fragment.id = 'fragment';

                return $.same(fragment, [fragment]).map((node) => node.id);
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

                return $.same(shadow, shadow).map((node) => node.id);
            });

            expect(ids).toEqual([
                'shadow',
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.same([
                    document.getElementById('div1'),
                    document.getElementById('div2'),
                    document.getElementById('div3'),
                    document.getElementById('div4'),
                ], '#div2, #div4').map((node) => node.id));

            expect(ids).toEqual([
                'div2',
                'div4',
            ]);
        });
    });
});
