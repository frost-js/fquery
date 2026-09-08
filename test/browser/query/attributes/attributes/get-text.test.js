import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1"><span>Test</span></div><div id="test2"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #getText', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns the text contents of the first node', async ({ page }) => {
        const text = await page.evaluate((_) => $('div').getText());

        expect(text).toBe('Test');
    });

    test('reads form contents when a control shadows textContent', async ({ page }) => {
        const text = await page.evaluate((_) => {
            document.body.innerHTML = '<form><input name="textContent"><span>Test</span></form>';
            return $('form').getText();
        });

        expect(text).toBe('Test');
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const text = await page.evaluate((_) => $('#invalid').getText());

        expect(text).toBe(undefined);
    });
});
