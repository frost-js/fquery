import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #nearestTo', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>' +
                '<div id="test2" style="display: block; width: 100px; height: 100px; margin: 1050px; padding: 50px;"></div>';
            window.scrollTo(1000, 1000);
        });
    });

    test('returns the nearest node to a position', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .nearestTo(1000, 1000)
                    .get()
                    .map((node) => node.id))).toEqual([
            'test2',
        ]);
    });

    test('returns the nearest node to a position with offset', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .nearestTo(1000, 1000, { offset: true })
                    .get()
                    .map((node) => node.id))).toEqual([
            'test1',
        ]);
    });

    test('returns an empty QuerySet for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#invalid')
                    .nearestTo(1000, 1000)
                    .get())).toEqual([]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.nearestTo(1000, 1000);
            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        })).toBe(true);
    });
});
