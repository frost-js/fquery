import { expect, test } from '#test';

test.describe('#hasDataset', () => {
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
            $.hasDataset('div', 'text'))).toBe(true);
    });

    test('returns true for an empty dataset value', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.getElementById('div2').setAttribute('data-empty', '');
            return $.hasDataset('div', 'empty');
        })).toBe(true);
    });

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

    test('returns false if no nodes have a specified attribute', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.hasDataset('div:not([data-text])', 'text'))).toBe(false);
    });

    for (const key of ['constructor', 'toString']) {
        test(`returns false for an inherited ${key} property`, async ({ page }) => {
            expect(await page.evaluate((key) =>
                $.hasDataset('div', key), key)).toBe(false);
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
