import { setScrollTests, setup } from '#cases/attributes/scroll/set-scroll.js';
import { expect, test } from '#test';

test.describe('#setScroll', () => {
    test.beforeEach(setup);

    setScrollTests((args) => $.setScroll(...args));

    test.describe('element inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const element = document.getElementById('test1');
                $.setScroll(element, 100, 50);
                return [
                    element.scrollLeft,
                    element.scrollTop,
                ];
            })).toEqual([100, 50]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.setScroll(document.querySelectorAll('div'), 100, 50);
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
            expect(await page.evaluate(() => {
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.setScroll(document.body.children, 100, 50);
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

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
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
});
