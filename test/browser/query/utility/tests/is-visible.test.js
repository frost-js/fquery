import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #isVisible', () => {
    test.beforeEach(async ({ page }) => {
        await page.addStyleTag({ content: '.test { display: none; }' });
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1">' +
                '<span></span>' +
                '</div>' +
                '<div id="div2" class="test">' +
                '<span></span>' +
                '</div>' +
                '<div id="div3">' +
                '<span></span>' +
                '</div>' +
                '<div id="div4" class="test">' +
                '<span></span>' +
                '</div>';
        });
    });

    test('returns true if any node is visible', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .isVisible())).toBe(true);
    });

    test('returns false if no nodes are visible', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('.test')
                    .isVisible())).toBe(false);
    });

    test('returns true if any node is a descendent of a visible node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('span')
                    .isVisible())).toBe(true);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(document)
                    .isVisible())).toBe(true);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $(window)
                    .isVisible())).toBe(true);
    });
});
