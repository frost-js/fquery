import { isFixedTests, setup } from '#cases/utility/tests/is-fixed.js';
import { expect, test } from '#test';

test.describe('#isFixed', () => {
    test.beforeEach(setup);

    isFixedTests((nodes) => $.isFixed(nodes));

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isFixed(
                document.getElementById('div2'),
            ))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isFixed(
                document.querySelectorAll('div'),
            ))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isFixed(
                document.body.children,
            ))).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isFixed([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ]))).toBe(true);
    });
});
