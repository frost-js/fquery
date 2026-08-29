import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #map', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div>' +
                '<span id="span1"></span>' +
                '</div>' +
                '<div>' +
                '<span id="span2"></span>' +
                '</div>';
        });
    });

    test('executes a callback on each node in the set, and creates a new set from the results', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .map((node) => node.firstChild)
                    .get()
                    .map((node) => node.id))).toEqual([
            'span1',
            'span2',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.map((node) => node.firstChild);
            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        })).toEqual(true);
    });
});
