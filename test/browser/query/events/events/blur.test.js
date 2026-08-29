import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #blur', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<input type="text" id="test1">' +
                '<input type="text" id="test2">';
        });
    });

    test('triggers a blur event on the first node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result;
            const element = document.getElementById('test1');
            element.addEventListener('blur', (_) => {
                result = true;
            });
            element.focus();
            $('input')
                    .blur();
            return result;
        })).toBe(true);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.getElementById('test1').focus();
            const query = $('input');
            return query === query.blur();
        })).toBe(true);
    });
});
