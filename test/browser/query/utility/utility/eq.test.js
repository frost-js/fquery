import { expect, test } from '#test';

test.describe('QuerySet #each', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML =
                '<div id="div1"></div>' +
                '<div id="div2"></div>' +
                '<div id="div3"></div>' +
                '<div id="div4"></div>';
        });
    });

    test('reduces the nodes to the specified index', async ({ page }) => {
        expect(await page.evaluate(() =>
            $('div')
                    .eq(1)
                    .get()
                    .map((node) => node.id))).toEqual([
            'div2',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        expect(await page.evaluate(() => {
            const query1 = $('div');
            const query2 = query1.eq(1);
            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        })).toEqual(true);
    });
});
