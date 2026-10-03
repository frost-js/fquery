import { childTests, setup } from '#cases/traversal/traversal/child.js';
import { expect, test } from '#test';

test.describe('#child', () => {
    test.beforeEach(setup);

    childTests((args) => $.child(...args).map((node) => node.id));

    test('returns an empty array for empty nodes', async ({ page }) => {
        const ids = await page.evaluate(() => $.child('#invalid'));

        expect(ids).toEqual([]);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.child(document.getElementById('parent1'), 'span').map((node) => node.id));

            expect(ids).toEqual([
                'child3',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.child(document.querySelectorAll('.parent'), 'span').map((node) => node.id));

            expect(ids).toEqual([
                'child3',
                'child7',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.child(document.body.children, 'span').map((node) => node.id));

            expect(ids).toEqual([
                'child3',
                'child7',
            ]);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    '<div id="div1"></div><div id="div2"></div>',
                );

                return $.child(fragment, 'div').map((node) => node.id);
            });

            expect(ids).toEqual([
                'div1',
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const ids = await page.evaluate(() => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    '<div id="div1"></div><div id="div2"></div>',
                );
                shadow.appendChild(fragment);

                return $.child(shadow, 'div').map((node) => node.id);
            });

            expect(ids).toEqual([
                'div1',
            ]);
        });

        test('works with Document nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.child(document, 'html').map((node) => node.id));

            expect(ids).toEqual([
                'html',
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            const ids = await page.evaluate(() =>
                $.child(
                    [
                        document.getElementById('parent1'),
                        document.getElementById('parent2'),
                    ],
                    'span',
                ).map((node) => node.id));

            expect(ids).toEqual([
                'child3',
                'child7',
            ]);
        });
    });
});
