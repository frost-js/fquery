import { expect, test } from '#test';

test.describe('QuerySet #first', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML =
                '<div id="div1"></div>' +
                '<div id="div2"></div>' +
                '<div id="div3"></div>' +
                '<div id="div4"></div>';
        });
    });

    test('reduces the nodes to the first', async ({ page }) => {
        expect(await page.evaluate(() =>
            $('div')
                    .first()
                    .get()
                    .map((node) => node.id))).toEqual([
            'div1',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        expect(await page.evaluate(() => {
            const query1 = $('div');
            const query2 = query1.first();
            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        })).toEqual(true);
    });
});
