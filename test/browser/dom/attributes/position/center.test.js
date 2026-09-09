import { centerTests, setup } from '#cases/attributes/position/center.js';
import { expect, test } from '#test';

test.describe('#center', () => {
    test.beforeEach(setup);

    centerTests((args) => $.center(...args));

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.center(
                document.getElementById('test1'),
            ))).toEqual({
            x: 700,
            y: 150,
        });
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.center(
                document.querySelectorAll('div'),
            ))).toEqual({
            x: 700,
            y: 150,
        });
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.center(
                document.body.children,
            ))).toEqual({
            x: 700,
            y: 150,
        });
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.center([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ]))).toEqual({
            x: 700,
            y: 150,
        });
    });
});
