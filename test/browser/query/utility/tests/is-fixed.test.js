import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #isFixed', () => {
    test.beforeEach(async ({ page }) => {
        await page.addStyleTag({ content: '.test { position: fixed; }' });
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1">' +
                '<span id="span1"></span>' +
                '</div>' +
                '<div id="div2" class="test">' +
                '<span id="span2"></span>' +
                '</div>' +
                '<div id="div3">' +
                '<span id="span3"></span>' +
                '</div>' +
                '<div id="div4" class="test">' +
                '<span id="span4"></span>' +
                '</div>';
        });
    });

    test('returns true if any node is fixed', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .isFixed())).toBe(true);
    });

    test('returns false if no nodes are fixed', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div:not(.test)')
                    .isFixed())).toBe(false);
    });

    test('returns true if any node is a descendent of a fixed node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('span')
                    .isFixed())).toBe(true);
    });
});
