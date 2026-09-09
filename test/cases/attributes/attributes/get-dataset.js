/** @import { Page } from '@playwright/test'; */

import { expect, test } from '#test';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML = '<div id="test1" data-text="Test" data-number="123.456" data-true="true" data-false="false" data-null="null" data-array="[1,2,3]" data-object="{&quot;a&quot;:1}"></div><div id="test2"></div>';
    });
};

/**
 * Registers shared getDataset behavior tests.
 * @param {((args: [string, string?]) => unknown)} getDataset The browser callback for getDataset.
 */
export function getDatasetTests(getDataset) {
    test('returns an object with all dataset values for the first node', async ({ page }) => {
        const dataset = await page.evaluate(getDataset, ['div']);

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
        const value = await page.evaluate(getDataset, ['div', 'text']);

        expect(value).toBe('Test');
    });

    test('returns an empty dataset value', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test1').setAttribute('data-empty', '');
        });

        const value = await page.evaluate(getDataset, ['div', 'empty']);

        expect(value).toBe('');
    });

    test('parses number values', async ({ page }) => {
        const value = await page.evaluate(getDataset, ['div', 'number']);

        expect(value).toBe(123.456);
    });

    test('parses boolean true values', async ({ page }) => {
        const value = await page.evaluate(getDataset, ['div', 'true']);

        expect(value).toBe(true);
    });

    test('parses boolean false values', async ({ page }) => {
        const value = await page.evaluate(getDataset, ['div', 'false']);

        expect(value).toBe(false);
    });

    test('parses null values', async ({ page }) => {
        const value = await page.evaluate(getDataset, ['div', 'null']);

        expect(value).toBe(null);
    });

    test('parses JSON array values', async ({ page }) => {
        const value = await page.evaluate(getDataset, ['div', 'array']);

        expect(value).toEqual([1, 2, 3]);
    });

    test('parses JSON object values', async ({ page }) => {
        const value = await page.evaluate(getDataset, ['div', 'object']);

        expect(value).toEqual({ a: 1 });
    });

    for (const key of ['constructor', 'toString']) {
        test(`returns undefined for an inherited ${key} property`, async ({ page }) => {
            const value = await page.evaluate(getDataset, ['div', key]);

            expect(value).toBe(undefined);
        });
    }

    test('returns undefined for empty nodes', async ({ page }) => {
        const value = await page.evaluate(getDataset, ['#invalid', 'text']);

        expect(value).toBe(undefined);
    });
}
