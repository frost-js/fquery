import { heightTests, setup } from '#cases/attributes/size/height.js';
import { expect, test } from '#test';

test.describe('QuerySet #height', () => {
    test.beforeEach(setup);

    heightTests((nodes) => $(nodes).height());

    test('returns the content box height of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .height({ boxSize: $.CONTENT_BOX }))).toBe(1000);
    });

    test('returns zero content box height for a hidden element with padding', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.getElementById('test1').style.cssText = 'display: none; padding: 10px;';
            return $('#test1').height({ boxSize: $.CONTENT_BOX });
        })).toBe(0);
    });

    test('returns the border box height of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .height({ boxSize: $.BORDER_BOX }))).toBe(1052);
    });

    test('includes horizontal scrollbar space in the border box height', async ({ page }) => {
        await page.addStyleTag({ content: '#test1::-webkit-scrollbar { width: 15px; height: 15px; }' });

        const hasScrollbar = await page.evaluate((_) => {
            const node = document.getElementById('test1');
            node.style.cssText = 'display: block; width: 100px; height: 100px; padding: 10px; border: 2px solid; margin: 10px; box-sizing: border-box; overflow: scroll;';
            return node.offsetHeight - node.clientHeight > 4;
        });

        test.skip(!hasScrollbar, 'Scrollbars do not occupy layout space in this browser.');

        expect(await page.evaluate((_) =>
            $('#test1').height({ boxSize: $.BORDER_BOX }))).toBe(100);
    });

    test('returns the border box height of an SVG element', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<svg style="display: block; width: 100px; height: 100px; padding: 10px; border: 2px solid; box-sizing: content-box;"></svg>';
            return $('svg').height({ boxSize: $.BORDER_BOX });
        })).toBe(124);
    });

    test('returns the margin box height of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .height({ boxSize: $.MARGIN_BOX }))).toBe(1152);
    });

    test('includes horizontal scrollbar space in the margin box height', async ({ page }) => {
        await page.addStyleTag({ content: '#test1::-webkit-scrollbar { width: 15px; height: 15px; }' });

        const hasScrollbar = await page.evaluate((_) => {
            const node = document.getElementById('test1');
            node.style.cssText = 'display: block; width: 100px; height: 100px; padding: 10px; border: 2px solid; margin: 10px; box-sizing: border-box; overflow: scroll;';
            return node.offsetHeight - node.clientHeight > 4;
        });

        test.skip(!hasScrollbar, 'Scrollbars do not occupy layout space in this browser.');

        expect(await page.evaluate((_) =>
            $('#test1').height({ boxSize: $.MARGIN_BOX }))).toBe(120);
    });

    test('returns the scroll box height of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .height({ boxSize: $.SCROLL_BOX }))).toBe(2550);
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
