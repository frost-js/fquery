import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #percentY', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>' +
                '<div id="test2"></div>';
            window.scrollTo(1000, 1000);
        });
    });

    test('returns the percent of a position along the Y-axis for the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .percentY(150))).toBe(50);
    });

    test('returns the percent of a position along the Y-axis for the first node with offset', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .percentY(1150, { offset: true }))).toBe(50);
    });

    test('clamps the returned value between 0 and 100', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return [
                query.percentY(0),
                query.percentY(2000),
            ];
        })).toEqual([
            0,
            100,
        ]);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#invalid')
                    .percentY(150))).toBe(undefined);
    });
});
