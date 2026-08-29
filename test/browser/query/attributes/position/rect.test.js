import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #rect', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>' +
                '<div id="test2"></div>';
            window.scrollTo(1000, 1000);
        });
    });

    test('returns the bounding rectangle of the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .rect()
                    .toJSON())).toEqual({
            x: 600,
            y: 50,
            width: 200,
            height: 200,
            top: 50,
            right: 800,
            bottom: 250,
            left: 600,
        });
    });

    test('returns the bounding rectangle of the first node with offset', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .rect({ offset: true })
                    .toJSON())).toEqual({
            x: 1058,
            y: 1050,
            width: 200,
            height: 200,
            top: 1050,
            right: 1258,
            bottom: 1250,
            left: 1058,
        });
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#invalid')
                    .rect())).toBe(undefined);
    });
});
