import { expect, test } from '#test';

test.describe('QuerySet #hasDataset', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1" data-text="Test"></div>' +
                '<div id="div2"></div>' +
                '<div id="div3" data-text="Test"></div>' +
                '<div id="div4"></div>';
        });
    });

    test('returns true if any node has a specified attribute', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .hasDataset('text'))).toBe(true);
    });

    test('returns true for an empty dataset value', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.getElementById('div2').setAttribute('data-empty', '');
            return $('div').hasDataset('empty');
        })).toBe(true);
    });

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

    test('returns false if no nodes have a specified attribute', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div:not([data-text])')
                    .hasDataset('text'))).toBe(false);
    });

    for (const key of ['constructor', 'toString']) {
        test(`returns false for an inherited ${key} property`, async ({ page }) => {
            expect(await page.evaluate((key) =>
                $('div').hasDataset(key), key)).toBe(false);
        });
    }
});
