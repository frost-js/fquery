import { expect, test } from '#test';

test.describe('QuerySet #removeAttribute', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML = '<input type="text" id="test1" disabled><input type="number" id="test2" disabled>';
        });
    });

    test('removes an attribute for all nodes', async ({ page }) => {
        await page.evaluate(() => {
            $('input').removeAttribute('disabled');
        });

        expect(await page.locator('#test1').getAttribute('disabled')).toBeNull();
        expect(await page.locator('#test2').getAttribute('disabled')).toBeNull();
    });

    test('returns the QuerySet', async ({ page }) => {
        const isSameQuerySet = await page.evaluate(() => {
            const query = $('input');

            return query === query.removeAttribute('disabled');
        });

        expect(isSameQuerySet).toBe(true);
    });
});
