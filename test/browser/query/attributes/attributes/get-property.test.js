import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<input type="text" id="test1"><input type="number" id="test2">';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #getProperty', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
        await page.evaluate((_) => {
            document.getElementById('test1').test = 'Test 1';
            document.getElementById('test2').test = 'Test 2';
        });
    });

    test('returns a property value for the first node', async ({ page }) => {
        const value = await page.evaluate((_) => $('input').getProperty('test'));

        expect(value).toBe('Test 1');
    });

    test('returns undefined for an undefined property', async ({ page }) => {
        const value = await page.evaluate((_) => $('input').getProperty('invalid'));

        expect(value).toBe(undefined);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const value = await page.evaluate((_) => $('#invalid').getProperty('test'));

        expect(value).toBe(undefined);
    });
});
