import { getScrollXTests, setup } from '#cases/attributes/scroll/get-scroll-x.js';
import { expect, test } from '#test';

test.describe('#getScrollX', () => {
    test.beforeEach(setup);

    getScrollXTests((nodes) => $.getScrollX(nodes));

    test.describe('element inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.getScrollX(document.getElementById('test1')))).toBe(100);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.getScrollX(document.querySelectorAll('div')))).toBe(100);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.getScrollX(document.body.children))).toBe(100);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.getScrollX([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                ]))).toBe(100);
        });
    });
});
