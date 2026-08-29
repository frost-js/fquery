import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #setScrollX', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1" style="display: block; width: 100px; height: 1px; overflow: scroll;">' +
                '<div style="display: block; width: 1000px; height: 1px;"></div>' +
                '</div>' +
                '<div id="test2" style="display: block; width: 100px; height: 1px; overflow: scroll;">' +
                '<div style="display: block; width: 1000px; height: 1px;"></div>' +
                '</div>';
        });
    });

    test('sets the scroll X position for all nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $('div')
                    .setScrollX(100);
            return [
                document.getElementById('test1').scrollLeft,
                document.getElementById('test2').scrollLeft,
            ];
        })).toEqual([
            100,
            100,
        ]);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.setScrollX(100);
        })).toBe(true);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="display: block; width: 1000px; height: 1000px;"></div>';
            $(document)
                    .setScrollX(100);
            return document.scrollingElement.scrollLeft;
        })).toBe(100);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="display: block; width: 1000px; height: 1000px;"></div>';
            $(window)
                    .setScrollX(100);
            return window.scrollX;
        })).toBe(100);
    });
});
