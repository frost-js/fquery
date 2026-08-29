import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#hasAttribute', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1" class="test"></div>' +
                '<div id="div2"></div>' +
                '<div id="div3" class="test"></div>' +
                '<div id="div4"></div>';
        });
    });

    test('returns true if any node has a specified attribute', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasAttribute('div', 'class'))).toBe(true);
    });

    test('returns false if no nodes have a specified attribute', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasAttribute('div:not(.test)', 'class'))).toBe(false);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasAttribute(
                document.getElementById('div1'),
                'class',
            ))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasAttribute(
                document.querySelectorAll('div'),
                'class',
            ))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasAttribute(
                document.body.children,
                'class',
            ))).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasAttribute([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ], 'class'))).toBe(true);
    });
});
