import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1" data-text="Test"></div><div id="test2" data-text="Test"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #removeDataset', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('removes a dataset value for all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $('div').removeDataset('text');
        });

        expect(await page.locator('#test1').getAttribute('data-text')).toBeNull();
        expect(await page.locator('#test2').getAttribute('data-text')).toBeNull();
    });

    test('returns the QuerySet', async ({ page }) => {
        const isSameQuerySet = await page.evaluate((_) => {
            const query = $('div');

            return query === query.removeDataset('text');
        });

        expect(isSameQuerySet).toBe(true);
    });
});
