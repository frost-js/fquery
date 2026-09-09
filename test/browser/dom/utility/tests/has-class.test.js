import { hasClassTests, setup } from '#cases/utility/tests/has-class.js';
import { expect, test } from '#test';

test.describe('#hasClass', () => {
    test.beforeEach(setup);

    hasClassTests((args) => $.hasClass(...args));

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasClass(
                document.getElementById('div1'),
                'test',
            ))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasClass(
                document.querySelectorAll('div'),
                'test',
            ))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasClass(
                document.body.children,
                'test',
            ))).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasClass([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ], 'test'))).toBe(true);
    });
});
