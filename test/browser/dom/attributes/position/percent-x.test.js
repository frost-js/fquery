import { percentXTests, setup } from '#cases/attributes/position/percent-x.js';
import { expect, test } from '#test';

test.describe('#percentX', () => {
    test.beforeEach(setup);

    percentXTests((args) => $.percentX(...args));

    test('clamps the returned value between 0 and 100', async ({ page }) => {
        expect(await page.evaluate(() => [
            $.percentX('div', 0),
            $.percentX('div', 2000),
        ])).toEqual([
            0,
            100,
        ]);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.percentX(document.getElementById('test1'), 700))).toBe(50);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.percentX(document.querySelectorAll('div'), 700))).toBe(50);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.percentX(document.body.children, 700))).toBe(50);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate(() =>
            $.percentX([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 700))).toBe(50);
    });
});
