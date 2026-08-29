import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<input type="number" id="test1"><input type="number" id="test2">';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #setAttribute', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('sets an attributes object for all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $('input').setAttribute({
                min: '1',
                max: '10',
            });
        });

        await expect(page.locator('#test1')).toHaveAttribute('min', '1');
        await expect(page.locator('#test1')).toHaveAttribute('max', '10');
        await expect(page.locator('#test2')).toHaveAttribute('min', '1');
        await expect(page.locator('#test2')).toHaveAttribute('max', '10');
    });

    test('sets an attribute for all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $('input').setAttribute('placeholder', '123');
        });

        await expect(page.locator('#test1')).toHaveAttribute('placeholder', '123');
        await expect(page.locator('#test2')).toHaveAttribute('placeholder', '123');
    });

    test('returns the QuerySet', async ({ page }) => {
        const isSameQuerySet = await page.evaluate((_) => {
            const query = $('input');

            return query === query.setAttribute('placeholder', '123');
        });

        expect(isSameQuerySet).toBe(true);
    });
});
