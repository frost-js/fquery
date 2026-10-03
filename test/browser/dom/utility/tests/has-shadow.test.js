import { hasShadowTests, setup } from '#cases/utility/tests/has-shadow.js';
import { expect, test } from '#test';

test.describe('#hasShadow', () => {
    test.beforeEach(setup);

    hasShadowTests((nodes) => $.hasShadow(nodes));

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.hasShadow(document.getElementById('div1')))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.hasShadow(document.querySelectorAll('div')))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.hasShadow(document.body.children))).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.hasShadow([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ]))).toBe(true);
    });
});
