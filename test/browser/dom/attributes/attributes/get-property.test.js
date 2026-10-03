import { getPropertyTests, setup } from '#cases/attributes/attributes/get-property.js';
import { expect, test } from '#test';

test.describe('#getProperty', () => {
    test.beforeEach(setup);

    getPropertyTests((args) => $.getProperty(...args));

    test('preserves named form property access', async ({ page }) => {
        const value = await page.evaluate(() => {
            document.body.innerHTML = '<form><input name="style" value="Test"></form>';
            return $.getProperty('form', 'style').value;
        });

        expect(value).toBe('Test');
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const value = await page.evaluate(() =>
            $.getProperty(document.getElementById('test1'), 'test'));

        expect(value).toBe('Test 1');
    });

    test('works with NodeList nodes', async ({ page }) => {
        const value = await page.evaluate(() =>
            $.getProperty(document.querySelectorAll('input'), 'test'));

        expect(value).toBe('Test 1');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const value = await page.evaluate(() =>
            $.getProperty(document.body.children, 'test'));

        expect(value).toBe('Test 1');
    });

    test('works with array nodes', async ({ page }) => {
        const value = await page.evaluate(() =>
            $.getProperty([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'test'));

        expect(value).toBe('Test 1');
    });
});
