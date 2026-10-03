import { setScrollXTests, setup } from '#cases/attributes/scroll/set-scroll-x.js';
import { expect, test } from '#test';

test.describe('#setScrollX', () => {
    test.beforeEach(setup);

    setScrollXTests((args) => $.setScrollX(...args));

    test.describe('element inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const element = document.getElementById('test1');
                $.setScrollX(element, 100);
                return element.scrollLeft;
            })).toBe(100);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.setScrollX(document.querySelectorAll('div'), 100);
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
            expect(await page.evaluate(() => {
                $.setScrollX(document.body.children, 100);
                return [
                    document.getElementById('test1').scrollLeft,
                    document.getElementById('test2').scrollLeft,
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
});
