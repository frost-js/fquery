import { isVisibleTests, setup } from '#cases/utility/tests/is-visible.js';
import { expect, test } from '#test';

test.describe('#isVisible', () => {
    test.beforeEach(setup);

    isVisibleTests((nodes) => $.isVisible(nodes));

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isVisible(
                document.getElementById('div1'),
            ))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isVisible(
                document.querySelectorAll('div'),
            ))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isVisible(
                document.body.children,
            ))).toBe(true);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isVisible(document))).toBe(true);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isVisible(window))).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.isVisible([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ]))).toBe(true);
    });
});
