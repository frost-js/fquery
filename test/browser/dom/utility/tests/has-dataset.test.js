import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#hasDataset', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1" data-text="Test"></div>' +
                '<div id="div2"></div>' +
                '<div id="div3" data-text="Test"></div>' +
                '<div id="div4"></div>';
        });
    });

    test('returns true if any node has a specified attribute', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDataset('div', 'text'))).toBe(true);
    });

    test('returns false if no nodes have a specified attribute', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDataset('div:not([data-text])', 'text'))).toBe(false);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDataset(
                document.getElementById('div1'),
                'text',
            ))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDataset(
                document.querySelectorAll('div'),
                'text',
            ))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDataset(
                document.body.children,
                'text',
            ))).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDataset([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ], 'text'))).toBe(true);
    });
});
