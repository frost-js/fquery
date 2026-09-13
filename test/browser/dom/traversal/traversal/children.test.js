import { childrenTests, setup } from '#cases/traversal/traversal/children.js';
import { expect, test } from '#test';

test.describe('#children', () => {
    test.beforeEach(setup);

    childrenTests(() => $.children);

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate((_) => $.children('#invalid'));

        expect(ids).toEqual([]);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.children(document.getElementById('parent1'), 'span').map((node) => node.id));

            expect(ids).toEqual([
                'child3',
                'child4',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.children(document.querySelectorAll('.parent'), 'span').map((node) => node.id));

            expect(ids).toEqual([
                'child3',
                'child4',
                'child7',
                'child8',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.children(document.body.children, 'span').map((node) => node.id));

            expect(ids).toEqual([
                'child3',
                'child4',
                'child7',
                'child8',
            ]);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    '<div id="div1"></div><div id="div2"></div>',
                );

                return $.children(fragment, 'div').map((node) => node.id);
            });

            expect(ids).toEqual([
                'div1',
                'div2',
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const ids = await page.evaluate((_) => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    '<div id="div1"></div><div id="div2"></div>',
                );
                shadow.appendChild(fragment);

                return $.children(shadow, 'div').map((node) => node.id);
            });

            expect(ids).toEqual([
                'div1',
                'div2',
            ]);
        });

        test('works with Document nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.children(document, 'html').map((node) => node.id));

            expect(ids).toEqual([
                'html',
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.children(
                    [
                        document.getElementById('parent1'),
                        document.getElementById('parent2'),
                    ],
                    'span',
                ).map((node) => node.id));

            expect(ids).toEqual([
                'child3',
                'child4',
                'child7',
                'child8',
            ]);
        });
    });
});
