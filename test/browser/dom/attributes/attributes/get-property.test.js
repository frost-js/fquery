import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<input type="text" id="test1"><input type="number" id="test2">';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#getProperty', () => {
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
        const value = await page.evaluate((_) => $.getProperty('input', 'test'));

        expect(value).toBe('Test 1');
    });

    test('returns undefined for an undefined property', async ({ page }) => {
        const value = await page.evaluate((_) => $.getProperty('input', 'invalid'));

        expect(value).toBe(undefined);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const value = await page.evaluate((_) => $.getProperty('#invalid', 'test'));

        expect(value).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const value = await page.evaluate((_) =>
            $.getProperty(document.getElementById('test1'), 'test'));

        expect(value).toBe('Test 1');
    });

    test('works with NodeList nodes', async ({ page }) => {
        const value = await page.evaluate((_) =>
            $.getProperty(document.querySelectorAll('input'), 'test'));

        expect(value).toBe('Test 1');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const value = await page.evaluate((_) =>
            $.getProperty(document.body.children, 'test'));

        expect(value).toBe('Test 1');
    });

    test('works with array nodes', async ({ page }) => {
        const value = await page.evaluate((_) =>
            $.getProperty([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'test'));

        expect(value).toBe('Test 1');
    });
});
