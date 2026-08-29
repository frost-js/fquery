import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#percentY', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>' +
                '<div id="test2"></div>';
            window.scrollTo(1000, 1000);
        });
    });

    test('returns the percent of a position along the Y-axis for the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.percentY('div', 150))).toBe(50);
    });

    test('returns the percent of a position along the Y-axis for the first node with offset', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.percentY('div', 1150, { offset: true }))).toBe(50);
    });

    test('clamps the returned value between 0 and 100', async ({ page }) => {
        expect(await page.evaluate((_) => [
            $.percentY('div', 0),
            $.percentY('div', 2000),
        ])).toEqual([
            0,
            100,
        ]);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.percentY('#invalid', 150))).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.percentY(
                document.getElementById('test1'),
                150,
            ))).toBe(50);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.percentY(
                document.querySelectorAll('div'),
                150,
            ))).toBe(50);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.percentY(
                document.body.children,
                150,
            ))).toBe(50);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.percentY([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 150))).toBe(50);
    });
});
