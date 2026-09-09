import { hasDatasetTests, setup } from '#cases/utility/tests/has-dataset.js';
import { expect, test } from '#test';

test.describe('#hasDataset', () => {
    test.beforeEach(setup);

    hasDatasetTests((args) => $.hasDataset(...args));

    for (const [attribute, key] of [
        ['data-constructor', 'constructor'],
        ['data-to-string', 'toString'],
    ]) {
        test(`returns true for a ${attribute} attribute`, async ({ page }) => {
            expect(await page.evaluate(([attribute, key]) => {
                document.getElementById('div2').setAttribute(attribute, 'Test');
                return $.hasDataset('div', key);
            }, [attribute, key])).toBe(true);
        });
    }

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDataset(
                document.getElementById('div1'),
                'text',
            ))).toBe(true);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDataset(
                document.querySelectorAll('div'),
                'text',
            ))).toBe(true);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDataset(
                document.body.children,
                'text',
            ))).toBe(true);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDataset([
                document.getElementById('div1'),
                document.getElementById('div2'),
                document.getElementById('div3'),
                document.getElementById('div4'),
            ], 'text'))).toBe(true);
    });
});
