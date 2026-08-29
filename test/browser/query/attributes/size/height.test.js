import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #height', () => {
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
            $('div')
                    .height())).toBe(1050);
    });

    test('returns the content box height of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .height({ boxSize: $.CONTENT_BOX }))).toBe(1000);
    });

    test('returns the border box height of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .height({ boxSize: $.BORDER_BOX }))).toBe(1052);
    });

    test('returns the margin box height of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .height({ boxSize: $.MARGIN_BOX }))).toBe(1152);
    });

    test('returns the scroll box height of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .height({ boxSize: $.SCROLL_BOX }))).toBe(2550);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#invalid')
                    .height())).toBe(undefined);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(document)
                    .height())).toBe(1152);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(window)
                    .height())).toBe(600);
    });
});
