import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1"><span>Test</span></div><div id="test2"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #getHTML', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns the HTML contents of the first node', async ({ page }) => {
        const html = await page.evaluate((_) => $('div').getHTML());

        expect(html).toBe('<span>Test</span>');
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const html = await page.evaluate((_) => $('#invalid').getHTML());

        expect(html).toBe(undefined);
    });
});
