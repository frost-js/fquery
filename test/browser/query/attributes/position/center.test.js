import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #center', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>' +
                '<div id="test2"></div>';
            window.scrollTo(1000, 1000);
        });
    });

    test('returns the center position of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .center())).toEqual({
            x: 700,
            y: 150,
        });
    });

    test('returns the center position of the first node with offset', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .center({ offset: true }))).toEqual({
            x: 1158,
            y: 1150,
        });
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#invalid')
                    .center())).toBe(undefined);
    });
});
