import { removeTests, setup } from '#cases/manipulation/manipulation/remove.js';
import { expect, test } from '#test';

test.describe('QuerySet #remove', () => {
    test.beforeEach(setup);

    removeTests(() => (nodes, ...args) => {
        $(nodes).remove(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        const returnsSameQuery = await page.evaluate(() => {
            const query = $('a');

            return query === query.remove();
        });

        expect(returnsSameQuery).toBe(true);
    });

    test.describe('node inputs', () => {
        test('removes meta nodes with a content attribute', async ({ page }) => {
            await page.evaluate(() => {
                document.head.innerHTML = '<meta name="description" content="Test 1">';

                $('meta').remove();
            });

            await expect(page.locator('head > meta')).toHaveCount(0);
        });

        test('removes forms with a control named remove', async ({ page }) => {
            await page.evaluate(() => {
                document.body.innerHTML = '<form><input name="remove"></form>';

                $('form').remove();
            });

            await expect(page.locator('form')).toHaveCount(0);
        });
    });
});
