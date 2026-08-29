import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #click', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>';
        });
    });

    test('triggers a click event on the first node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result;
            const element = document.getElementById('test1');
            element.addEventListener('click', (_) => {
                result = true;
            });
            $('a')
                    .click();
            return result;
        })).toBe(true);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('a');
            return query === query.click();
        })).toBe(true);
    });
});
