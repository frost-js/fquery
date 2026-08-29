import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #hasProperty', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1" class="test"></div>' +
                '<div id="div2"></div>' +
                '<div id="div3" class="test"></div>' +
                '<div id="div4"></div>';
            document.getElementById('div1').test = 'Test 1';
            document.getElementById('div3').test = 'Test 2';
        });
    });

    test('returns true if any node has a specified property', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .hasProperty('test'))).toBe(true);
    });

    test('returns false if no nodes have a specified property', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div:not(.test)')
                    .hasProperty('test'))).toBe(false);
    });
});
