import { setScrollYTests, setup } from '#cases/attributes/scroll/set-scroll-y.js';
import { expect, test } from '#test';

test.describe('#setScrollY', () => {
    test.beforeEach(setup);

    setScrollYTests((args) => $.setScrollY(...args));

    test.describe('element inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const element = document.getElementById('test1');
                $.setScrollY(element, 100);
                return element.scrollTop;
            })).toBe(100);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.setScrollY(document.querySelectorAll('div'), 100);
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
            expect(await page.evaluate(() => {
                $.setScrollY(document.body.children, 100);
                return [
                    document.getElementById('test1').scrollTop,
                    document.getElementById('test2').scrollTop,
                ];
            })).toEqual([
                100,
                100,
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
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
});
