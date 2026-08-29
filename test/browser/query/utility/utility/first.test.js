import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #first', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1"></div>' +
                '<div id="div2"></div>' +
                '<div id="div3"></div>' +
                '<div id="div4"></div>';
        });
    });

    test('reduces the nodes to the first', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .first()
                    .get()
                    .map((node) => node.id))).toEqual([
            'div1',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.first();
            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        })).toEqual(true);
    });
});
