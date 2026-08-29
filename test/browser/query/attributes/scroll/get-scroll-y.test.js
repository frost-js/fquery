import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #getScrollY', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1" style="display: block; height: 100px; overflow-y: scroll;">' +
                '<div style="display: block; width: 1px; height: 1000px;"></div>' +
                '</div>' +
                '<div id="test2"></div>';
            document.getElementById('test1').scrollTop = 100;
        });
    });

    test('returns the scroll Y position of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .getScrollY())).toBe(100);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#invalid')
                    .getScrollY())).toBe(undefined);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="block; width: 1000px; height: 1000px;"></div>';
            document.scrollingElement.scrollTop = 100;
            return $(document)
                    .getScrollY();
        })).toBe(100);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="block; width: 1000px; height: 1000px;"></div>';
            window.scrollTo(0, 100);
            return $(window)
                    .getScrollY();
        })).toBe(100);
    });
});
