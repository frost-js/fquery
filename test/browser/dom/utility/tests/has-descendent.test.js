import { expect, test } from '#test';

test.describe('#hasDescendent', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1" class="test">' +
                '<span id="span1">' +
                '<a id="a1"></a>' +
                '</span>' +
                '</div>' +
                '<div id="div2"></div>' +
                '<div id="div3" class="test">' +
                '<span id="span2">' +
                '<a id="a2"></a>' +
                '</span>' +
                '</div>' +
                '<div id="div4"></div>';
        });
    });

    test('returns true if any node has a descendent matching a filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDescendent('div', 'a'))).toBe(true);
    });

    test('returns true if any node has a descendent without a filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDescendent('div'))).toBe(true);
    });

    test('returns false if no nodes have a descendent matching a filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDescendent('div:not(.test)', 'a'))).toBe(false);
    });

    test('returns false if no nodes have a descendent without a filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDescendent('div:not(.test)'))).toBe(false);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDescendent(
                document.getElementById('div1'),
                'a',
            ))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDescendent(
                document.body.children,
                'a',
            ))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDescendent(
                document.querySelectorAll('div'),
                'a',
            ))).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const range = document.createRange();
            const fragment = range.createContextualFragment(
                '<div></div>',
            );
            return $.hasDescendent(fragment, 'div');
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
            return $.hasDescendent(shadow, 'div');
        })).toBe(true);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDescendent(document, 'div'))).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDescendent([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ], 'a'))).toBe(true);
    });

    test('works with function filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDescendent(
                'div',
                (node) => node.id === 'a1',
            ))).toBe(true);
    });

    test('works with HTMLElement filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDescendent(
                'div',
                document.getElementById('a1'),
            ))).toBe(true);
    });

    test('does not match the node itself with an HTMLElement filter', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const node = document.getElementById('div1');
            return $.hasDescendent(node, node);
        })).toBe(false);
    });

    test('works with NodeList filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDescendent(
                'div',
                document.querySelectorAll('a'),
            ))).toBe(true);
    });

    test('works with HTMLCollection filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDescendent(
                'div',
                document.getElementById('span1').children,
            ))).toBe(true);
    });

    test('does not match the node itself with an array filter', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const node = document.getElementById('div1');
            return $.hasDescendent(node, [node]);
        })).toBe(false);
    });

    test('matches a descendent when the array filter also contains the node itself', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const node = document.getElementById('div1');
            const child = document.getElementById('span1');
            return $.hasDescendent(node, [node, child]);
        })).toBe(true);
    });

    test('works with array filter', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDescendent('div', [
                document.getElementById('a1'),
                document.getElementById('a2'),
            ]))).toBe(true);
    });
});
