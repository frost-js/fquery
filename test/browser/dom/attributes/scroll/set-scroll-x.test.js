import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#setScrollX', () => {
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
            $.setScrollX('div', 100);
            return [
                document.getElementById('test1').scrollLeft,
                document.getElementById('test2').scrollLeft,
            ];
        })).toEqual([
            100,
            100,
        ]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const element = document.getElementById('test1');
            $.setScrollX(element, 100);
            return element.scrollLeft;
        })).toBe(100);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setScrollX(
                document.querySelectorAll('div'),
                100,
            );
            return [
                document.getElementById('test1').scrollLeft,
                document.getElementById('test2').scrollLeft,
            ];
        })).toEqual([
            100,
            100,
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setScrollX(
                document.body.children,
                100,
            );
            return [
                document.getElementById('test1').scrollLeft,
                document.getElementById('test2').scrollLeft,
            ];
        })).toEqual([
            100,
            100,
        ]);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="display: block; width: 1000px; height: 1000px;"></div>';
            $.setScrollX(document, 100);
            return document.scrollingElement.scrollLeft;
        })).toBe(100);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="display: block; width: 1000px; height: 1000px;"></div>';
            $.setScrollX(window, 100);
            return window.scrollX;
        })).toBe(100);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.setScrollX([
                element1,
                element2,
            ], 100);
            return [
                element1.scrollLeft,
                element2.scrollLeft,
            ];
        })).toEqual([
            100,
            100,
        ]);
    });
});
