import { hasPropertyTests, setup } from '#cases/utility/tests/has-property.js';
import { expect, test } from '#test';

test.describe('#hasProperty', () => {
    test.beforeEach(setup);

    hasPropertyTests((args) => $.hasProperty(...args));

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.hasProperty(document.getElementById('div1'), 'test'))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.hasProperty(document.querySelectorAll('div'), 'test'))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.hasProperty(document.body.children, 'test'))).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.hasProperty([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ], 'test'))).toBe(true);
    });
});
