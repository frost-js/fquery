import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#setScrollY', () => {
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
            $.setScrollY('div', 100);
            return [
                document.getElementById('test1').scrollTop,
                document.getElementById('test2').scrollTop,
            ];
        })).toEqual([
            100,
            100,
        ]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const element = document.getElementById('test1');
            $.setScrollY(element, 100);
            return element.scrollTop;
        })).toBe(100);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setScrollY(
                document.querySelectorAll('div'),
                100,
            );
            return [
                document.getElementById('test1').scrollTop,
                document.getElementById('test2').scrollTop,
            ];
        })).toEqual([
            100,
            100,
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setScrollY(
                document.body.children,
                100,
            );
            return [
                document.getElementById('test1').scrollTop,
                document.getElementById('test2').scrollTop,
            ];
        })).toEqual([
            100,
            100,
        ]);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="display: block; width: 1000px; height: 1000px;"></div>';
            $.setScrollY(document, 100);
            return document.scrollingElement.scrollTop;
        })).toBe(100);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="display: block; width: 1000px; height: 1000px;"></div>';
            $.setScrollY(window, 100);
            return window.scrollY;
        })).toBe(100);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.setScrollY([
                element1,
                element2,
            ], 100);
            return [
                element1.scrollTop,
                element2.scrollTop,
            ];
        })).toEqual([
            100,
            100,
        ]);
    });
});
