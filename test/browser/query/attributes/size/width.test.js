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

    test('measures forms with a control named clientWidth', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML =
                '<form style="width: 100px; padding: 0; border: 0;">' +
                '<input type="hidden" name="clientWidth">' +
                '</form>';
            return $('form').width();
        })).toBe(100);
    });

    test('returns the content box width of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .width({ boxSize: $.CONTENT_BOX }))).toBe(1200);
    });

    test('returns zero content box width for a hidden element with padding', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.getElementById('test1').style.cssText = 'display: none; padding: 10px;';
            return $('#test1').width({ boxSize: $.CONTENT_BOX });
        })).toBe(0);
    });

    test('returns the border box width of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .width({ boxSize: $.BORDER_BOX }))).toBe(1252);
    });

    test('includes vertical scrollbar space in the border box width', async ({ page }) => {
        await page.addStyleTag({ content: '#test1::-webkit-scrollbar { width: 15px; height: 15px; }' });

        const hasScrollbar = await page.evaluate((_) => {
            const node = document.getElementById('test1');
            node.style.cssText = 'display: block; width: 100px; height: 100px; padding: 10px; border: 2px solid; margin: 10px; box-sizing: border-box; overflow: scroll;';
            return node.offsetWidth - node.clientWidth > 4;
        });

        test.skip(!hasScrollbar, 'Scrollbars do not occupy layout space in this browser.');

        expect(await page.evaluate((_) =>
            $('#test1').width({ boxSize: $.BORDER_BOX }))).toBe(100);
    });

    test('returns the border box width of an SVG element', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<svg style="display: block; width: 100px; height: 100px; padding: 10px; border: 2px solid; box-sizing: content-box;"></svg>';
            return $('svg').width({ boxSize: $.BORDER_BOX });
        })).toBe(124);
    });

    test('returns the margin box width of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .width({ boxSize: $.MARGIN_BOX }))).toBe(1352);
    });

    test('includes vertical scrollbar space in the margin box width', async ({ page }) => {
        await page.addStyleTag({ content: '#test1::-webkit-scrollbar { width: 15px; height: 15px; }' });

        const hasScrollbar = await page.evaluate((_) => {
            const node = document.getElementById('test1');
            node.style.cssText = 'display: block; width: 100px; height: 100px; padding: 10px; border: 2px solid; margin: 10px; box-sizing: border-box; overflow: scroll;';
            return node.offsetWidth - node.clientWidth > 4;
        });

        test.skip(!hasScrollbar, 'Scrollbars do not occupy layout space in this browser.');

        expect(await page.evaluate((_) =>
            $('#test1').width({ boxSize: $.MARGIN_BOX }))).toBe(120);
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
