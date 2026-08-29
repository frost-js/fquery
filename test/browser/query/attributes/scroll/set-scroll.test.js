import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #setScroll', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1" style="display: block; width: 100px; height: 100px; overflow: scroll;">' +
                '<div style="display: block; width: 1000px; height: 1000px;"></div>' +
                '</div>' +
                '<div id="test2" style="display: block; width: 100px; height: 100px; overflow: scroll;">' +
                '<div style="display: block; width: 1000px; height: 1000px;"></div>' +
                '</div>';
        });
    });

    test('sets the scroll position for all nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $('div')
                    .setScroll(100, 50);
            return [
                [
                    element1.scrollLeft,
                    element1.scrollTop,
                ],
                [
                    element2.scrollLeft,
                    element2.scrollTop,
                ],
            ];
        })).toEqual([
            [100, 50],
            [100, 50],
        ]);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.setScroll(100, 50);
        })).toBe(true);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="display: block; width: 1000px; height: 1000px;"></div>';
            $(document)
                    .setScroll(100, 50);
            return [
                document.scrollingElement.scrollLeft,
                document.scrollingElement.scrollTop,
            ];
        })).toEqual([100, 50]);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="display: block; width: 1000px; height: 1000px;"></div>';
            $(window)
                    .setScroll(100, 50);
            return [
                window.scrollX,
                window.scrollY,
            ];
        })).toEqual([100, 50]);
    });
});
