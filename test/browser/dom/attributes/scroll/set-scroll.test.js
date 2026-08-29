import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#setScroll', () => {
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
            $.setScroll('div', 100, 50);
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

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const element = document.getElementById('test1');
            $.setScroll(element, 100, 50);
            return [
                element.scrollLeft,
                element.scrollTop,
            ];
        })).toEqual([100, 50]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.setScroll(
                document.querySelectorAll('div'),
                100,
                50,
            );
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

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.setScroll(
                document.body.children,
                100,
                50,
            );
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

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="display: block; width: 1000px; height: 1000px;"></div>';
            $.setScroll(document, 100, 50);
            return [
                document.scrollingElement.scrollLeft,
                document.scrollingElement.scrollTop,
            ];
        })).toEqual([100, 50]);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<div style="display: block; width: 1000px; height: 1000px;"></div>';
            $.setScroll(window, 100, 50);
            return [
                window.scrollX,
                window.scrollY,
            ];
        })).toEqual([100, 50]);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.setScroll([
                element1,
                element2,
            ], 100, 50);
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
});
