import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#tagName', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1"></div>' +
                '<div id="div2"></div>' +
                '<span id="span1"></span>' +
                '<span id="span2"></span>';
        });
    });

    test('returns the tag name of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.tagName('div'))).toBe('div');
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.tagName(
                document.getElementById('span1'),
            ))).toBe('span');
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.tagName(
                document.querySelectorAll('div'),
            ))).toBe('div');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.tagName(
                document.body.children,
            ))).toBe('div');
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.tagName([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('span1'),
                document.getElementById('span2'),
            ]))).toBe('div');
    });
});
