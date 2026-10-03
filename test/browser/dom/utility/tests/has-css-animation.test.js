import { hasCssAnimationTests, setup } from '#cases/utility/tests/has-css-animation.js';
import { expect, test } from '#test';

test.describe('#hasCssAnimation', () => {
    test.beforeEach(setup);

    hasCssAnimationTests((nodes) => $.hasCssAnimation(nodes));

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.hasCssAnimation(document.getElementById('div1')))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.hasCssAnimation(document.querySelectorAll('div')))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.hasCssAnimation(document.body.children))).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.hasCssAnimation([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ]))).toBe(true);
    });
});
