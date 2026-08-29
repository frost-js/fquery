import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1" data-text="Test" data-number="123.456" data-true="true" data-false="false" data-null="null" data-array="[1,2,3]" data-object="{&quot;a&quot;:1}"></div><div id="test2"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#getDataset', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns an object with all dataset values for the first node', async ({ page }) => {
        const dataset = await page.evaluate((_) => $.getDataset('div'));

        expect(dataset).toEqual({
            text: 'Test',
            number: 123.456,
            true: true,
            false: false,
            null: null,
            array: [1, 2, 3],
            object: { a: 1 },
        });
    });

    test('returns a dataset value for the first node', async ({ page }) => {
        const value = await page.evaluate((_) => $.getDataset('div', 'text'));

        expect(value).toBe('Test');
    });

    test('parses number values', async ({ page }) => {
        const value = await page.evaluate((_) => $.getDataset('div', 'number'));

        expect(value).toBe(123.456);
    });

    test('parses boolean true values', async ({ page }) => {
        const value = await page.evaluate((_) => $.getDataset('div', 'true'));

        expect(value).toBe(true);
    });

    test('parses boolean false values', async ({ page }) => {
        const value = await page.evaluate((_) => $.getDataset('div', 'false'));

        expect(value).toBe(false);
    });

    test('parses null values', async ({ page }) => {
        const value = await page.evaluate((_) => $.getDataset('div', 'null'));

        expect(value).toBe(null);
    });

    test('parses JSON array values', async ({ page }) => {
        const value = await page.evaluate((_) => $.getDataset('div', 'array'));

        expect(value).toEqual([1, 2, 3]);
    });

    test('parses JSON object values', async ({ page }) => {
        const value = await page.evaluate((_) => $.getDataset('div', 'object'));

        expect(value).toEqual({ a: 1 });
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const value = await page.evaluate((_) => $.getDataset('#invalid', 'text'));

        expect(value).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const value = await page.evaluate((_) =>
            $.getDataset(document.getElementById('test1'), 'text'));

        expect(value).toBe('Test');
    });

    test('works with NodeList nodes', async ({ page }) => {
        const value = await page.evaluate((_) =>
            $.getDataset(document.querySelectorAll('div'), 'text'));

        expect(value).toBe('Test');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const value = await page.evaluate((_) =>
            $.getDataset(document.body.children, 'text'));

        expect(value).toBe('Test');
    });

    test('works with array nodes', async ({ page }) => {
        const value = await page.evaluate((_) =>
            $.getDataset([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'text'));

        expect(value).toBe('Test');
    });
});
