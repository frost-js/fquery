import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1"><span>Test</span></div><div id="test2"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#getHTML', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('returns the HTML contents of the first node', async ({ page }) => {
        const html = await page.evaluate((_) => $.getHTML('div'));

        expect(html).toBe('<span>Test</span>');
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        const html = await page.evaluate((_) => $.getHTML('#invalid'));

        expect(html).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        const html = await page.evaluate((_) =>
            $.getHTML(document.getElementById('test1')));

        expect(html).toBe('<span>Test</span>');
    });

    test('works with NodeList nodes', async ({ page }) => {
        const html = await page.evaluate((_) =>
            $.getHTML(document.querySelectorAll('div')));

        expect(html).toBe('<span>Test</span>');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const html = await page.evaluate((_) =>
            $.getHTML(document.body.children));

        expect(html).toBe('<span>Test</span>');
    });

    test('works with array nodes', async ({ page }) => {
        const html = await page.evaluate((_) =>
            $.getHTML([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ]));

        expect(html).toBe('<span>Test</span>');
    });
});
