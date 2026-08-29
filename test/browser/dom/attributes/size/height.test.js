import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#height', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1" style="display: block; height: 1000px; width: 1200px; margin: 50px; padding: 25px; border: 1px solid grey; overflow-y: scroll;">' +
                '<div style="display: block; width: 1px; height: 2500px;"></div>' +
                '</div>' +
                '<div id="test2"></div>';
        });
    });

    test('returns the height of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.height('div'))).toBe(1050);
    });

    test('returns the content box height of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.height('div', { boxSize: $.CONTENT_BOX }))).toBe(1000);
    });

    test('returns the border box height of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.height('div', { boxSize: $.BORDER_BOX }))).toBe(1052);
    });

    test('returns the margin box height of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.height('div', { boxSize: $.MARGIN_BOX }))).toBe(1152);
    });

    test('returns the scroll box height of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.height('div', { boxSize: $.SCROLL_BOX }))).toBe(2550);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.height('#invalid'))).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.height(
                document.getElementById('test1'),
            ))).toBe(1050);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.height(
                document.querySelectorAll('div'),
            ))).toBe(1050);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.height(
                document.body.children,
            ))).toBe(1050);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.height(document))).toBe(1152);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.height(window))).toBe(600);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.height([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ]))).toBe(1050);
    });
});
