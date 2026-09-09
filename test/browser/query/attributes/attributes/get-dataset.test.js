import { getDatasetTests, setup } from '#cases/attributes/attributes/get-dataset.js';
import { expect, test } from '#test';

test.describe('QuerySet #getDataset', () => {
    test.beforeEach(setup);

    getDatasetTests(([nodes, ...args]) => $(nodes).getDataset(...args));

    for (const [attribute, key, raw, expected] of [
        ['data-constructor', 'constructor', '123.456', 123.456],
        ['data-to-string', 'toString', 'Test', 'Test'],
    ]) {
        test(`returns a ${attribute} attribute value`, async ({ page }) => {
            const value = await page.evaluate(([attribute, key, raw]) => {
                document.getElementById('test1').setAttribute(attribute, raw);
                return $('div').getDataset(key);
            }, [attribute, key, raw]);

            expect(value).toBe(expected);
        });
    }
});
