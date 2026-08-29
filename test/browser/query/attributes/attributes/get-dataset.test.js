import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1" data-text="Test" data-number="123.456" data-true="true" data-false="false" data-null="null" data-array="[1,2,3]" data-object="{&quot;a&quot;:1}"></div><div id="test2"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #getDataset', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns an object with all dataset values for the first node', async ({ page }) => {
        const dataset = await page.evaluate((_) => $('div').getDataset());

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
        const value = await page.evaluate((_) => $('div').getDataset('text'));

        expect(value).toBe('Test');
    });

    test('parses number values', async ({ page }) => {
        const value = await page.evaluate((_) => $('div').getDataset('number'));

        expect(value).toBe(123.456);
    });

    test('parses boolean true values', async ({ page }) => {
        const value = await page.evaluate((_) => $('div').getDataset('true'));

        expect(value).toBe(true);
    });

    test('parses boolean false values', async ({ page }) => {
        const value = await page.evaluate((_) => $('div').getDataset('false'));

        expect(value).toBe(false);
    });

    test('parses null values', async ({ page }) => {
        const value = await page.evaluate((_) => $('div').getDataset('null'));

        expect(value).toBe(null);
    });

    test('parses JSON array values', async ({ page }) => {
        const value = await page.evaluate((_) => $('div').getDataset('array'));

        expect(value).toEqual([1, 2, 3]);
    });

    test('parses JSON object values', async ({ page }) => {
        const value = await page.evaluate((_) => $('div').getDataset('object'));

        expect(value).toEqual({ a: 1 });
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const value = await page.evaluate((_) => $('#invalid').getDataset('text'));

        expect(value).toBe(undefined);
    });
});
