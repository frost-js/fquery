import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #isSame', () => {
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
            $('div')
                    .isSame('#div2, #div4'))).toBe(true);
    });

    test('returns false if no nodes are identical to any other node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .isSame('span'))).toBe(false);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            return $(fragment)
                    .isSame([fragment]);
        })).toBe(true);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            return $(shadow)
                    .isSame([shadow]);
        })).toBe(true);
    });

    test('works with HTMLElement other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .isSame(
                        document.getElementById('div2'),
                    ))).toBe(true);
    });

    test('works with NodeList other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .isSame(
                        document.querySelectorAll('#div2, #div4'),
                    ))).toBe(true);
    });

    test('works with HTMLCollection other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .isSame(
                        document.body.children,
                    ))).toBe(true);
    });

    test('works with DocumentFragment other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            return $([fragment])
                    .isSame(fragment);
        })).toBe(true);
    });

    test('works with ShadowRoot other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            return $([shadow])
                    .isSame(shadow);
        })).toBe(true);
    });

    test('works with array other nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .isSame([
                        document.querySelector('#div2'),
                        document.querySelector('#div4'),
                    ]))).toBe(true);
    });

    test('works with QuerySet other nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('#div2, #div4');
            return $('div')
                    .isSame(query);
        })).toBe(true);
    });
});
