import { expect, test } from '#test';

test.describe('#index', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML =
                '<div id="div1"></div>' +
                '<div id="div2" class="test"></div>' +
                '<div id="div3"></div>' +
                '<div id="div4" class="test"></div>';
        });
    });

    test('returns the index of the first node relative to the parent', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.index('.test'))).toBe(1);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.index(document.getElementById('div2')))).toBe(1);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.index(document.querySelectorAll('.test')))).toBe(1);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.index(document.body.children))).toBe(0);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.index([
                document.getElementById('div2'),
                document.getElementById('div4'),
            ]))).toBe(1);
    });
});
