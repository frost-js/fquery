import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #hasFragment', () => {
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
            $('template')
                    .hasFragment())).toBe(true);
    });

    test('returns false if no nodes have a document fragment', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .hasFragment())).toBe(false);
    });
});
