import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #position', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="parent" style="position: relative; margin: 1050px; padding: 25px 50px;">' +
                '<div id="test1" data-toggle="child" style="display: block; width: 100px; height: 100px; padding: 50px;"></div>' +
                '<div id="test2" data-toggle="child"></div>';
            window.scrollTo(1000, 1000);
        });
    });

    test('returns the position of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('[data-toggle="child"]')
                    .position())).toEqual({
            x: 50,
            y: 25,
        });
    });

    test('returns the position of the first node with offset', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('[data-toggle="child"]')
                    .position({ offset: true }))).toEqual({
            x: 1108,
            y: 1075,
        });
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#invalid')
                    .position())).toBe(undefined);
    });
});
