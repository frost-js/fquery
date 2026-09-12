import { setup, withDescendentTests } from '#cases/traversal/filter/with-descendent.js';
import { expect, test } from '#test';

test.describe('#withDescendent', () => {
    test.beforeEach(setup);

    withDescendentTests((args) => $.withDescendent(...args).map((node) => node.id));

    test('returns no nodes for empty elements without a filter', async ({ page }) => {
        const ids = await page.evaluate((_) =>
            $.withDescendent('#div2, #div4').map((node) => node.id));

        expect(ids).toEqual([]);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.withDescendent(document.getElementById('div1'), 'a').map((node) => node.id));

            expect(ids).toEqual([
                'div1',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.withDescendent(document.querySelectorAll('div'), 'a').map((node) => node.id));

            expect(ids).toEqual([
                'div1',
                'div3',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.withDescendent(document.body.children, 'a').map((node) => node.id));

            expect(ids).toEqual([
                'div1',
                'div3',
            ]);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const range = document.createRange();
                const fragment = range.createContextualFragment('<div></div>');
                fragment.id = 'fragment';

                return $.withDescendent(fragment, 'div').map((node) => node.id);
            });

            expect(ids).toEqual([
                'fragment',
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                const range = document.createRange();
                const fragment = range.createContextualFragment('<div></div>');

                shadow.appendChild(fragment);
                shadow.id = 'shadow';

                return $.withDescendent(shadow, 'div').map((node) => node.id);
            });

            expect(ids).toEqual([
                'shadow',
            ]);
        });

        test('works with Document nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.withDescendent(document, 'div').map((node) => node.id));

            expect(ids).toEqual([
                'document',
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.withDescendent([
                    document.getElementById('div1'),
                    document.getElementById('div2'),
                    document.getElementById('div3'),
                    document.getElementById('div4'),
                ], 'a').map((node) => node.id));

            expect(ids).toEqual([
                'div1',
                'div3',
            ]);
        });
    });
});
