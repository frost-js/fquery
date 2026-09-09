import { positionTests, setup } from '#cases/attributes/position/position.js';
import { expect, test } from '#test';

test.describe('#position', () => {
    test.beforeEach(setup);

    positionTests((args) => $.position(...args));

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.position(
                document.getElementById('test1'),
            ))).toEqual({
            x: 50,
            y: 25,
        });
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.position(
                document.querySelectorAll('[data-toggle="child"]'),
            ))).toEqual({
            x: 50,
            y: 25,
        });
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.position(
                document.getElementById('parent').children,
            ))).toEqual({
            x: 50,
            y: 25,
        });
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.position([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ]))).toEqual({
            x: 50,
            y: 25,
        });
    });
});
