import { getTextTests, setup } from '#cases/attributes/attributes/get-text.js';
import { expect, test } from '#test';

test.describe('#getText', () => {
    test.beforeEach(setup);

    getTextTests((nodes) => $.getText(nodes));

    test('works with HTMLElement nodes', async ({ page }) => {
        const text = await page.evaluate(() =>
            $.getText(document.getElementById('test1')));

        expect(text).toBe('Test');
    });

    test('works with NodeList nodes', async ({ page }) => {
        const text = await page.evaluate(() =>
            $.getText(document.querySelectorAll('div')));

        expect(text).toBe('Test');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const text = await page.evaluate(() =>
            $.getText(document.body.children));

        expect(text).toBe('Test');
    });

    test('works with array nodes', async ({ page }) => {
        const text = await page.evaluate(() =>
            $.getText([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ]));

        expect(text).toBe('Test');
    });
});
