import { expect, test } from '#test';

test.describe('QuerySet #hasDataset', () => {
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
            $('div')
                    .hasDataset('text'))).toBe(true);
    });

    test('returns true for an empty dataset value', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.getElementById('div2').setAttribute('data-empty', '');
            return $('div').hasDataset('empty');
        })).toBe(true);
    });

    test('returns true for a data-constructor attribute', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.getElementById('div2').setAttribute('data-constructor', 'Test');
            return $('div').hasDataset('constructor');
        })).toBe(true);
    });

    test('returns true for a data-to-string attribute', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.getElementById('div2').setAttribute('data-to-string', 'Test');
            return $('div').hasDataset('toString');
        })).toBe(true);
    });

    test('returns false if no nodes have a specified attribute', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div:not([data-text])')
                    .hasDataset('text'))).toBe(false);
    });

    test('returns false for an inherited constructor', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div').hasDataset('constructor'))).toBe(false);
    });

    test('returns false for an inherited toString method', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div').hasDataset('toString'))).toBe(false);
    });
});
