import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #removeProperty', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<input type="checkbox" id="test1">' +
                '<input type="checkbox" id="test2">';
            document.getElementById('test1').test = 'Test 1';
            document.getElementById('test2').test = 'Test 2';
        });
    });

    test('removes a property for all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $('input')
                    .removeProperty('test');
        });

        expect(await page.locator('#test1').evaluate((element) => element.test))
            .toBeUndefined();
        expect(await page.locator('#test2').evaluate((element) => element.test))
            .toBeUndefined();
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('input');
            return query === query.removeProperty('test');
        })).toBe(true);
    });
});
