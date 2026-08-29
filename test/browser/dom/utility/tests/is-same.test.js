import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#isSame', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1"></div>' +
                '<div id="div2"></div>' +
                '<div id="div3"></div>' +
                '<div id="div4"></div>';
        });
    });

    test('returns true if any node is identical to any other node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isSame('div', '#div2, #div4'))).toBe(true);
    });

    test('returns false if no nodes are identical to any other node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isSame('div', 'span'))).toBe(false);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isSame(
                document.getElementById('div2'),
                '#div2, #div4',
            ))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isSame(
                document.querySelectorAll('div'),
                '#div2, #div4',
            ))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isSame(
                document.body.children,
                '#div2, #div4',
            ))).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            return $.isSame(
                fragment,
                [
                    fragment,
                ],
            );
        })).toBe(true);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            return $.isSame(
                shadow,
                [
                    shadow,
                ],
            );
        })).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isSame([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ], '#div2, #div4'))).toBe(true);
    });

    test('works with HTMLElement other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isSame(
                'div',
                document.getElementById('div2'),
            ))).toBe(true);
    });

    test('works with NodeList other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isSame(
                'div',
                document.querySelectorAll('#div2, #div4'),
            ))).toBe(true);
    });

    test('works with HTMLCollection other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isSame(
                'div',
                document.body.children,
            ))).toBe(true);
    });

    test('works with DocumentFragment other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            return $.isSame(
                [
                    fragment,
                ],
                fragment,
            );
        })).toBe(true);
    });

    test('works with ShadowRoot other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            return $.isSame(
                [
                    shadow,
                ],
                shadow,
            );
        })).toBe(true);
    });

    test('works with array other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isSame('div', [
                document.querySelector('#div2'),
                document.querySelector('#div4'),
            ]))).toBe(true);
    });
});
