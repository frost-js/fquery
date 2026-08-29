import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#getScrollX', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1" style="display: block; width: 100px; overflow-x: scroll;">' +
                '<div style="display: block; width: 1000px; height: 1px;"></div>' +
                '</div>' +
                '<div id="test2"></div>';
            document.getElementById('test1').scrollLeft = 100;
        });
    });

    test('returns the scroll X position of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.getScrollX('div'))).toBe(100);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.getScrollX('#invalid'))).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.getScrollX(
                document.getElementById('test1'),
            ))).toBe(100);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.getScrollX(
                document.querySelectorAll('div'),
            ))).toBe(100);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.getScrollX(
                document.body.children,
            ))).toBe(100);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="block; width: 1000px; height: 1000px;"></div>';
            document.scrollingElement.scrollLeft = 100;
            return $.getScrollX(document);
        })).toBe(100);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="block; width: 1000px; height: 1000px;"></div>';
            window.scrollTo(100, 0);
            return $.getScrollX(window);
        })).toBe(100);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.getScrollX([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ]))).toBe(100);
    });
});
