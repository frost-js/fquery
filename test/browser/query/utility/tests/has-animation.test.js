import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #hasAnimation', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1" class="test"></div>' +
                '<div id="div2"></div>' +
                '<div id="div3" class="test"></div>' +
                '<div id="div4"></div>';
            $.fadeIn(
                '.test',
            );
        });
    });

    test('returns true if any node has an animation', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .hasAnimation())).toBe(true);
    });

    test('returns false if no nodes have an animation', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div:not(.test)')
                    .hasAnimation())).toBe(false);
    });
});
