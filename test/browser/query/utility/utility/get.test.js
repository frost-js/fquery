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

    test('reduces the nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .get()
                    .map((node) => node.id))).toEqual([
            'div1',
            'div2',
            'div3',
            'div4',
        ]);
    });

    test('reduces the node at an index', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .get(1).id)).toBe('div2');
    });
});
