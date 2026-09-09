import { getValueTests } from '#cases/attributes/attributes/get-value.js';
import { expect, test } from '#test';

test.describe('#getValue', () => {
    getValueTests((nodes) => $.getValue(nodes));

    test('works with HTMLElement nodes', async ({ page }) => {
        const value = await page.evaluate((_) =>
            $.getValue(document.getElementById('test1')));

        expect(value).toBe('Test 1');
    });

    test('works with NodeList nodes', async ({ page }) => {
        const value = await page.evaluate((_) =>
            $.getValue(document.querySelectorAll('input')));

        expect(value).toBe('Test 1');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const value = await page.evaluate((_) =>
            $.getValue(document.body.children));

        expect(value).toBe('Test 1');
    });

    test('works with array nodes', async ({ page }) => {
        const value = await page.evaluate((_) =>
            $.getValue([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ]));

        expect(value).toBe('Test 1');
    });
});
