import { getScrollYTests, setup } from '#cases/attributes/scroll/get-scroll-y.js';
import { expect, test } from '#test';

test.describe('#getScrollY', () => {
    test.beforeEach(setup);

    getScrollYTests((nodes) => $.getScrollY(nodes));

    test.describe('element inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.getScrollY(document.getElementById('test1')))).toBe(100);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.getScrollY(document.querySelectorAll('div')))).toBe(100);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.getScrollY(document.body.children))).toBe(100);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.getScrollY([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                ]))).toBe(100);
        });
    });
});
