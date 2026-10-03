import { getDatasetTests, setup } from '#cases/attributes/attributes/get-dataset.js';
import { expect, test } from '#test';

test.describe('#getDataset', () => {
    test.beforeEach(setup);

    getDatasetTests((args) => $.getDataset(...args));

    for (const [attribute, key, raw, expected] of [
        ['data-constructor', 'constructor', '123.456', 123.456],
        ['data-to-string', 'toString', 'Test', 'Test'],
    ]) {
        test(`returns a ${attribute} attribute value`, async ({ page }) => {
            const value = await page.evaluate(([attribute, key, raw]) => {
                document.getElementById('test1').setAttribute(attribute, raw);
                return $.getDataset('div', key);
            }, [attribute, key, raw]);

            expect(value).toBe(expected);
        });
    }

    test('works with HTMLElement nodes', async ({ page }) => {
        const value = await page.evaluate(() =>
            $.getDataset(document.getElementById('test1'), 'text'));

        expect(value).toBe('Test');
    });

    test('works with NodeList nodes', async ({ page }) => {
        const value = await page.evaluate(() =>
            $.getDataset(document.querySelectorAll('div'), 'text'));

        expect(value).toBe('Test');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const value = await page.evaluate(() =>
            $.getDataset(document.body.children, 'text'));

        expect(value).toBe('Test');
    });

    test('works with array nodes', async ({ page }) => {
        const value = await page.evaluate(() =>
            $.getDataset([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'text'));

        expect(value).toBe('Test');
    });
});
