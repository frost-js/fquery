import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1"><span>Test</span></div><div id="test2"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#getText', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns the text contents of the first node', async ({ page }) => {
        const text = await page.evaluate((_) => $.getText('div'));

        expect(text).toBe('Test');
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const text = await page.evaluate((_) => $.getText('#invalid'));

        expect(text).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const text = await page.evaluate((_) =>
            $.getText(document.getElementById('test1')));

        expect(text).toBe('Test');
    });

    test('works with NodeList nodes', async ({ page }) => {
        const text = await page.evaluate((_) =>
            $.getText(document.querySelectorAll('div')));

        expect(text).toBe('Test');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const text = await page.evaluate((_) =>
            $.getText(document.body.children));

        expect(text).toBe('Test');
    });

    test('works with array nodes', async ({ page }) => {
        const text = await page.evaluate((_) =>
            $.getText([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ]));

        expect(text).toBe('Test');
    });
});
