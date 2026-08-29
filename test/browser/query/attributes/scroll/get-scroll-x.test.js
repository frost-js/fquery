import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #getScrollX', () => {
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
            $('div')
                    .getScrollX())).toBe(100);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#invalid')
                    .getScrollX())).toBe(undefined);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="block; width: 1000px; height: 1000px;"></div>';
            document.scrollingElement.scrollLeft = 100;
            return $(document)
                    .getScrollX();
        })).toBe(100);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="block; width: 1000px; height: 1000px;"></div>';
            window.scrollTo(100, 0);
            return $(window)
                    .getScrollX();
        })).toBe(100);
    });
});
