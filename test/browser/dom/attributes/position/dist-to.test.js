import { distToTests, setup } from '#cases/attributes/position/dist-to.js';
import { expect, test } from '#test';

test.describe('#distTo', () => {
    test.beforeEach(setup);

    distToTests((args) => $.distTo(...args));

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.distTo(document.getElementById('test1'), 580, 128))).toBe(122);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.distTo(document.querySelectorAll('div'), 580, 128))).toBe(122);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.distTo(document.body.children, 580, 128))).toBe(122);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.distTo([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 580, 128))).toBe(122);
    });
});
