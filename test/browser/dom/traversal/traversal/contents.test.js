import { contentsTests, setup } from '#cases/traversal/traversal/contents.js';
import { expect, test } from '#test';

test.describe('#contents', () => {
    test.beforeEach(setup);

    contentsTests((nodes) => $.contents(nodes).map((node) => node.textContent));

    test('returns an empty array for empty nodes', async ({ page }) => {
        const nodes = await page.evaluate((_) => $.contents('#invalid'));

        expect(nodes).toEqual([]);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const text = await page.evaluate((_) =>
                $.contents(document.getElementById('parent1')).map((node) => node.textContent));

            expect(text).toEqual([
                'Test 1',
                '',
                'Test 2',
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            const text = await page.evaluate((_) =>
                $.contents(document.querySelectorAll('.parent')).map((node) => node.textContent));

            expect(text).toEqual([
                'Test 1',
                '',
                'Test 2',
                'Test 3',
                '',
                'Test 4',
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const text = await page.evaluate((_) =>
                $.contents(document.body.children).map((node) => node.textContent));

            expect(text).toEqual([
                'Test 1',
                '',
                'Test 2',
                'Test 3',
                '',
                'Test 4',
            ]);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            const text = await page.evaluate((_) => {
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    'Test 1<div id="child1"></div>Test 2',
                );

                return $.contents(fragment).map((node) => node.textContent);
            });

            expect(text).toEqual([
                'Test 1',
                '',
                'Test 2',
            ]);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            const text = await page.evaluate((_) => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    'Test 1<div id="child1"></div>Test 2',
                );
                shadow.appendChild(fragment);

                return $.contents(shadow).map((node) => node.textContent);
            });

            expect(text).toEqual([
                'Test 1',
                '',
                'Test 2',
            ]);
        });

        test('works with Document nodes', async ({ page }) => {
            const ids = await page.evaluate((_) =>
                $.contents(document).map((node) => node.id));

            expect(ids).toEqual([
                'html',
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            const text = await page.evaluate((_) =>
                $.contents([
                    document.getElementById('parent1'),
                    document.getElementById('parent2'),
                ]).map((node) => node.textContent));

            expect(text).toEqual([
                'Test 1',
                '',
                'Test 2',
                'Test 3',
                '',
                'Test 4',
            ]);
        });
    });
});
