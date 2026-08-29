import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#width', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1" style="display: block; height: 1000px; width: 1200px; margin: 50px; padding: 25px; border: 1px solid grey; overflow-x: scroll">' +
                '<div style="display: block; height: 1px; width: 2500px;"></div>' +
                '</div>' +
                '<div id="test2"></div>';
        });
    });

    test('returns the width of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.width('div'))).toBe(1250);
    });

    test('returns the content box width of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.width('div', { boxSize: $.CONTENT_BOX }))).toBe(1200);
    });

    test('returns the border box width of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.width('div', { boxSize: $.BORDER_BOX }))).toBe(1252);
    });

    test('returns the margin box width of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.width('div', { boxSize: $.MARGIN_BOX }))).toBe(1352);
    });

    test('returns the scroll box width of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.width('div', { boxSize: $.SCROLL_BOX }))).toBe(2550);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.width('#invalid'))).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.width(
                document.getElementById('test1'),
            ))).toBe(1250);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.width(
                document.querySelectorAll('div'),
            ))).toBe(1250);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.width(
                document.body.children,
            ))).toBe(1250);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.width(document))).toBe(800);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.width(window))).toBe(800);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.width([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ]))).toBe(1250);
    });
});
