import { getPropertyTests, setup } from '#cases/attributes/attributes/get-property.js';
import { expect, test } from '#test';

test.describe('QuerySet #getProperty', () => {
    test.beforeEach(setup);

    getPropertyTests(([nodes, ...args]) => $(nodes).getProperty(...args));

    test('preserves named form property access', async ({ page }) => {
        const value = await page.evaluate(() => {
            document.body.innerHTML = '<form><input name="style" value="Test"></form>';
            return $('form').getProperty('style').value;
        });

        expect(value).toBe('Test');
    });
});
