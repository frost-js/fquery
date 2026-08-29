import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#distTo', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>' +
                '<div id="test2"></div>';
            window.scrollTo(1000, 1000);
        });
    });

    test('returns the distance to the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.distTo('div', 580, 128))).toBe(122);
    });

    test('returns the distance to the first node with offset', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.distTo('div', 1180, 1270, { offset: true }))).toBe(122);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.distTo('#invalid', 580, 128))).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.distTo(
                document.getElementById('test1'),
                580,
                128,
            ))).toBe(122);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.distTo(
                document.querySelectorAll('div'),
                580,
                128,
            ))).toBe(122);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.distTo(
                document.body.children,
                580,
                128,
            ))).toBe(122);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.distTo([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 580, 128))).toBe(122);
    });
});
