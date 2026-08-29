import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #each', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1"></div>' +
                '<div id="div2"></div>' +
                '<div id="div3"></div>' +
                '<div id="div4"></div>';
        });
    });

    test('executes a callback on each node in the set', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const results = [];
            $('div')
                    .each((node) => {
                        results.push(node.id);
                    });
            return results;
        })).toEqual([
            'div1',
            'div2',
            'div3',
            'div4',
        ]);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.each((_) => { });
        })).toEqual(true);
    });
});
