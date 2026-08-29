import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #setScrollY', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1" style="display: block; width: 1px; height: 100px; overflow: scroll;">' +
                '<div style="display: block; width: 1px; height: 1000px;"></div>' +
                '</div>' +
                '<div id="test2" style="display: block; width: 1px; height: 100px; overflow: scroll;">' +
                '<div style="display: block; width: 1px; height: 1000px;"></div>' +
                '</div>';
        });
    });

    test('sets the scroll Y position for all nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $('div')
                    .setScrollY(100);
            return [
                document.getElementById('test1').scrollTop,
                document.getElementById('test2').scrollTop,
            ];
        })).toEqual([
            100,
            100,
        ]);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.setScrollY(100);
        })).toBe(true);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="display: block; width: 1000px; height: 1000px;"></div>';
            $(document)
                    .setScrollY(100);
            return document.scrollingElement.scrollTop;
        })).toBe(100);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="display: block; width: 1000px; height: 1000px;"></div>';
            $(window)
                    .setScrollY(100);
            return window.scrollY;
        })).toBe(100);
    });
});
