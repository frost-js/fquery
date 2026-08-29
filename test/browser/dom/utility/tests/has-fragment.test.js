import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#hasFragment', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<template id="template1">' +
                'Test 1' +
                '</template>' +
                '<template id="template2">' +
                'Test 2' +
                '</template>' +
                '<div id="div1"></div>' +
                '<div id="div2"></div>';
        });
    });

    test('returns true if any node has a document fragment', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasFragment('template'))).toBe(true);
    });

    test('returns false if no nodes have a document fragment', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasFragment('div'))).toBe(false);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasFragment(
                document.getElementById('template1'),
            ))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasFragment(
                document.querySelectorAll('template'),
            ))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasFragment(
                document.body.children,
            ))).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasFragment([
                document.getElementById('template1'),
                document.getElementById('template2'),
                document.getElementById('div1'),
                document.getElementById('div2'),
            ]))).toBe(true);
    });
});
