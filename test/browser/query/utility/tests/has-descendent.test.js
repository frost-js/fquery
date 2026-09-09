import { hasDescendentTests, setup } from '#cases/utility/tests/has-descendent.js';
import { expect, test } from '#test';

test.describe('QuerySet #hasDescendent', () => {
    test.beforeEach(setup);

    hasDescendentTests(([nodes, ...args]) => $(nodes).hasDescendent(...args));

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const range = document.createRange();
            const fragment = range.createContextualFragment(
                '<div></div>',
            );
            return $(fragment)
                    .hasDescendent('div');
        })).toBe(true);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            const range = document.createRange();
            const fragment = range.createContextualFragment(
                '<div></div>',
            );
            shadow.appendChild(fragment);
            return $(shadow)
                    .hasDescendent('div');
        })).toBe(true);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(document)
                    .hasDescendent('div'))).toBe(true);
    });

    test('works with function filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .hasDescendent((node) => node.id === 'a1'))).toBe(true);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .hasDescendent(
                        document.getElementById('a1'),
                    ))).toBe(true);
    });

    test('does not match the node itself with an HTMLElement filter', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const node = document.getElementById('div1');
            return $(node).hasDescendent(node);
        })).toBe(false);
    });

    test('works with NodeList filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .hasDescendent(
                        document.querySelectorAll('a'),
                    ))).toBe(true);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .hasDescendent(
                        document.getElementById('span1').children,
                    ))).toBe(true);
    });

    test('does not match the node itself with an array filter', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const node = document.getElementById('div1');
            return $(node).hasDescendent([node]);
        })).toBe(false);
    });

    test('matches a descendent when the array filter also contains the node itself', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const node = document.getElementById('div1');
            const child = document.getElementById('span1');
            return $(node).hasDescendent([node, child]);
        })).toBe(true);
    });

    test('works with array filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .hasDescendent([
                        document.getElementById('a1'),
                        document.getElementById('a2'),
                    ]))).toBe(true);
    });

    test('works with QuerySet filter', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('a');
            return $('div')
                    .hasDescendent(query);
        })).toBe(true);
    });
});
