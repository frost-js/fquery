import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #width', () => {
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
            $('div')
                    .width())).toBe(1250);
    });

    test('returns the content box width of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .width({ boxSize: $.CONTENT_BOX }))).toBe(1200);
    });

    test('returns the border box width of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .width({ boxSize: $.BORDER_BOX }))).toBe(1252);
    });

    test('returns the margin box width of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .width({ boxSize: $.MARGIN_BOX }))).toBe(1352);
    });

    test('returns the scroll box width of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .width({ boxSize: $.SCROLL_BOX }))).toBe(2550);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#invalid')
                    .width())).toBe(undefined);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(document)
                    .width())).toBe(800);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(window)
                    .width())).toBe(800);
    });
});
