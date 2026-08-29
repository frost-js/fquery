import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<input type="text" id="test1" required><input type="number" id="test2">';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#getAttribute', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns an object with all attributes for the first node', async ({ page }) => {
        const attributes = await page.evaluate((_) => $.getAttribute('input'));

        expect(attributes).toEqual({
            type: 'text',
            id: 'test1',
            required: '',
        });
    });

    test('returns an attribute value for the first node', async ({ page }) => {
        const value = await page.evaluate((_) => $.getAttribute('input', 'type'));

        expect(value).toBe('text');
    });

    test('returns null for an undefined property', async ({ page }) => {
        const value = await page.evaluate((_) => $.getAttribute('input', 'disabled'));

        expect(value).toBe(null);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const value = await page.evaluate((_) => $.getAttribute('#invalid', 'type'));

        expect(value).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const value = await page.evaluate((_) =>
            $.getAttribute(document.getElementById('test1'), 'type'));

        expect(value).toBe('text');
    });

    test('works with NodeList nodes', async ({ page }) => {
        const value = await page.evaluate((_) =>
            $.getAttribute(document.querySelectorAll('input'), 'type'));

        expect(value).toBe('text');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const value = await page.evaluate((_) =>
            $.getAttribute(document.body.children, 'type'));

        expect(value).toBe('text');
    });

    test('works with array nodes', async ({ page }) => {
        const value = await page.evaluate((_) =>
            $.getAttribute([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'type'));

        expect(value).toBe('text');
    });
});
