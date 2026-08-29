import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #hasClass', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1" class="test"></div>' +
                '<div id="div2"></div>' +
                '<div id="div3" class="test"></div>' +
                '<div id="div4"></div>';
        });
    });

    test('returns true if any node has a specified class', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .hasClass('test'))).toBe(true);
    });

    test('returns false if no nodes have a specified class', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div:not(.test)')
                    .hasClass('test'))).toBe(false);
    });
});
