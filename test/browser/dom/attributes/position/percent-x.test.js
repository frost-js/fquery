import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#percentX', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>' +
                '<div id="test2"></div>';
            window.scrollTo(1000, 1000);
        });
    });

    test('returns the percent of a position along the X-axis for the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.percentX('div', 700))).toBe(50);
    });

    test('returns the percent of a position along the X-axis for the first node with offset', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.percentX('div', 1158, { offset: true }))).toBe(50);
    });

    test('clamps the returned value between 0 and 100', async ({ page }) => {
        expect(await page.evaluate((_) => [
            $.percentX('div', 0),
            $.percentX('div', 2000),
        ])).toEqual([
            0,
            100,
        ]);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.percentX('#invalid', 700))).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.percentX(
                document.getElementById('test1'),
                700,
            ))).toBe(50);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.percentX(
                document.querySelectorAll('div'),
                700,
            ))).toBe(50);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.percentX(
                document.body.children,
                700,
            ))).toBe(50);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.percentX([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 700))).toBe(50);
    });
});
