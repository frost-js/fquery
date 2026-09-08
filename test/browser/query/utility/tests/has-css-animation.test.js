import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #hasCSSAnimation', () => {
    test.beforeEach(async ({ page }) => {
        await page.addStyleTag({ content: '.test { animation: spin 4s linear infinite; }' +
            '@keyframes spin { 100% { transform: rotate(360deg); } }' });
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1" class="test"></div>' +
                '<div id="div2"></div>' +
                '<div id="div3" class="test"></div>' +
                '<div id="div4"></div>';
        });
    });

    test('returns true if any node has a CSS animation', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .hasCSSAnimation())).toBe(true);
    });

    test('returns true if a later CSS animation duration is nonzero', async ({ page }) => {
        await page.addStyleTag({ content: '.test { animation: spin 0s linear infinite, spin 1s linear infinite; }' });

        expect(await page.evaluate((_) =>
            $('div').hasCSSAnimation())).toBe(true);
    });

    test('returns false if all CSS animation durations are zero', async ({ page }) => {
        await page.addStyleTag({ content: '.test { animation: spin 0s linear infinite, spin 0s linear infinite; }' });

        expect(await page.evaluate((_) =>
            $('div').hasCSSAnimation())).toBe(false);
    });

    test('returns false if no nodes have a CSS animation', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div:not(.test)')
                    .hasCSSAnimation())).toBe(false);
    });
});
