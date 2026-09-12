import { setup, widthTests } from '#cases/attributes/size/width.js';
import { expect, test } from '#test';

test.describe('#width', () => {
    test.beforeEach(setup);

    widthTests((nodes) => $.width(nodes));

    test('returns the content box width of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.width('div', { boxSize: $.CONTENT_BOX }))).toBe(1200);
    });

    test('returns zero content box width for a hidden element with padding', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.getElementById('test1').style.cssText = 'display: none; padding: 10px;';
            return $.width('#test1', { boxSize: $.CONTENT_BOX });
        })).toBe(0);
    });

    test('returns the border box width of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.width('div', { boxSize: $.BORDER_BOX }))).toBe(1252);
    });

    test('returns the border box width of an SVG element', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<svg style="display: block; width: 100px; height: 100px; padding: 10px; border: 2px solid; box-sizing: content-box;"></svg>';
            return $.width('svg', { boxSize: $.BORDER_BOX });
        })).toBe(124);
    });

    test('returns the margin box width of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.width('div', { boxSize: $.MARGIN_BOX }))).toBe(1352);
    });

    test('returns the scroll box width of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.width('div', { boxSize: $.SCROLL_BOX }))).toBe(2550);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.width(document.getElementById('test1')))).toBe(1250);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.width(document.querySelectorAll('div')))).toBe(1250);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.width(document.body.children))).toBe(1250);
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
