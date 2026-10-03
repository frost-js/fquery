import { getAttributeTests, setup } from '#cases/attributes/attributes/get-attribute.js';
import { expect, test } from '#test';

test.describe('#getAttribute', () => {
    test.beforeEach(setup);

    getAttributeTests((args) => $.getAttribute(...args));

    test('works with HTMLElement nodes', async ({ page }) => {
        const value = await page.evaluate(() =>
            $.getAttribute(document.getElementById('test1'), 'type'));

        expect(value).toBe('text');
    });

    test('works with NodeList nodes', async ({ page }) => {
        const value = await page.evaluate(() =>
            $.getAttribute(document.querySelectorAll('input'), 'type'));

        expect(value).toBe('text');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const value = await page.evaluate(() =>
            $.getAttribute(document.body.children, 'type'));

        expect(value).toBe('text');
    });

    test('works with array nodes', async ({ page }) => {
        const value = await page.evaluate(() =>
            $.getAttribute([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'type'));

        expect(value).toBe('text');
    });
});
