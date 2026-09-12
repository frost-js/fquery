import { setup, widthTests } from '#cases/attributes/size/width.js';
import { expect, test } from '#test';

test.describe('QuerySet #width', () => {
    test.beforeEach(setup);

    widthTests((nodes) => $(nodes).width());

    test('returns the content box width of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div').width({ boxSize: $.CONTENT_BOX }))).toBe(1200);
    });

    test('returns zero content box width for a hidden element with padding', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.getElementById('test1').style.cssText = 'display: none; padding: 10px;';
            return $('#test1').width({ boxSize: $.CONTENT_BOX });
        })).toBe(0);
    });

    test('returns the border box width of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div').width({ boxSize: $.BORDER_BOX }))).toBe(1252);
    });

    test('returns the border box width of an SVG element', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<svg style="display: block; width: 100px; height: 100px; padding: 10px; border: 2px solid; box-sizing: content-box;"></svg>';
            return $('svg').width({ boxSize: $.BORDER_BOX });
        })).toBe(124);
    });

    test('returns the margin box width of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div').width({ boxSize: $.MARGIN_BOX }))).toBe(1352);
    });

    test('returns the scroll box width of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div').width({ boxSize: $.SCROLL_BOX }))).toBe(2550);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(document).width())).toBe(800);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(window).width())).toBe(800);
    });
});
