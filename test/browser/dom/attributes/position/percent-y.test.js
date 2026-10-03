import { percentYTests, setup } from '#cases/attributes/position/percent-y.js';
import { expect, test } from '#test';

test.describe('#percentY', () => {
    test.beforeEach(setup);

    percentYTests((args) => $.percentY(...args));

    test('clamps the returned value between 0 and 100', async ({ page }) => {
        expect(await page.evaluate(() => [
            $.percentY('div', 0),
            $.percentY('div', 2000),
        ])).toEqual([
            0,
            100,
        ]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.percentY(document.getElementById('test1'), 150))).toBe(50);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.percentY(document.querySelectorAll('div'), 150))).toBe(50);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.percentY(document.body.children, 150))).toBe(50);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.percentY([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 150))).toBe(50);
    });
});
