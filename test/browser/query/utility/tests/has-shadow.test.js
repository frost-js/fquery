import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #hasShadow', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1" class="test"></div>' +
                '<div id="div2"></div>' +
                '<div id="div3" class="test"></div>' +
                '<div id="div4"></div>';
            document.getElementById('div1').attachShadow({ mode: 'open' });
            document.getElementById('div3').attachShadow({ mode: 'closed' });
        });
    });

    test('returns true if any node has a shadow root', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .hasShadow())).toBe(true);
    });

    test('returns false if no nodes have a shadow root', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div:not(.test)')
                    .hasShadow())).toBe(false);
    });

    test('returns false for closed shadow roots', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#div3')
                    .hasShadow())).toBe(false);
    });
});
