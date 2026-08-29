import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<input type="text" id="test1" value="Test 1"><input type="number" id="test2"><textarea id="test3">Test 2</textarea><select id="test4"><option value="1">1</option><option value="2" selected>2</option></select><select id="test5"><option value="3">3</option><option value="4" selected>4</option></select>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #getValue', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns the input value of the first node', async ({ page }) => {
        const value = await page.evaluate((_) => $('input').getValue());

        expect(value).toBe('Test 1');
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const value = await page.evaluate((_) => $('#invalid').getValue());

        expect(value).toBe(undefined);
    });

    test('works with textarea input nodes', async ({ page }) => {
        const value = await page.evaluate((_) => $('textarea').getValue());

        expect(value).toBe('Test 2');
    });

    test('works with select input nodes', async ({ page }) => {
        const value = await page.evaluate((_) => $('select').getValue());

        expect(value).toBe('2');
    });
});
