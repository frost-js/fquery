import { hasAttributeTests, setup } from '#cases/utility/tests/has-attribute.js';
import { expect, test } from '#test';

test.describe('#hasAttribute', () => {
    test.beforeEach(setup);

    hasAttributeTests((args) => $.hasAttribute(...args));

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasAttribute(document.getElementById('div1'), 'class'))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasAttribute(document.querySelectorAll('div'), 'class'))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasAttribute(document.body.children, 'class'))).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasAttribute([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ], 'class'))).toBe(true);
    });
});
