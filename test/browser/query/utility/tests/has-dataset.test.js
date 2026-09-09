import { hasDatasetTests, setup } from '#cases/utility/tests/has-dataset.js';
import { expect, test } from '#test';

test.describe('QuerySet #hasDataset', () => {
    test.beforeEach(setup);

    hasDatasetTests(([nodes, ...args]) => $(nodes).hasDataset(...args));

    for (const [attribute, key] of [
        ['data-constructor', 'constructor'],
        ['data-to-string', 'toString'],
    ]) {
        test(`returns true for a ${attribute} attribute`, async ({ page }) => {
            expect(await page.evaluate(([attribute, key]) => {
                document.getElementById('div2').setAttribute(attribute, 'Test');
                return $('div').hasDataset(key);
            }, [attribute, key])).toBe(true);
        });
    }
});
