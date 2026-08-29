import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #slice', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1"></div>' +
                '<div id="div2"></div>' +
                '<div id="div3"></div>' +
                '<div id="div4"></div>';
        });
    });

    test('reduces the nodes to a subset of indexes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .slice(1, 3)
                    .get()
                    .map((node) => node.id))).toEqual([
            'div2',
            'div3',
        ]);
    });

    test('reduces the nodes to a subset of indexes (without end)', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .slice(1)
                    .get()
                    .map((node) => node.id))).toEqual([
            'div2',
            'div3',
            'div4',
        ]);
    });

    test('reduces the nodes to a subset of indexes (without start)', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .slice()
                    .get()
                    .map((node) => node.id))).toEqual([
            'div1',
            'div2',
            'div3',
            'div4',
        ]);
    });

    test('returns a new QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query1 = $('div');
            const query2 = query1.slice();
            return query2.constructor.name === 'QuerySet' && query1 !== query2;
        })).toEqual(true);
    });
});
