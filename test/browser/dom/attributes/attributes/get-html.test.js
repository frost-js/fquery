import { getHtmlTests, setup } from '#cases/attributes/attributes/get-html.js';
import { expect, test } from '#test';

test.describe('#getHtml', () => {
    test.beforeEach(setup);

    getHtmlTests((nodes) => $.getHtml(nodes));

    test('works with HTMLElement nodes', async ({ page }) => {
        const html = await page.evaluate(() =>
            $.getHtml(document.getElementById('test1')));

        expect(html).toBe('<span>Test</span>');
    });

    test('works with NodeList nodes', async ({ page }) => {
        const html = await page.evaluate(() =>
            $.getHtml(document.querySelectorAll('div')));

        expect(html).toBe('<span>Test</span>');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        const html = await page.evaluate(() =>
            $.getHtml(document.body.children));

        expect(html).toBe('<span>Test</span>');
    });

    test('works with array nodes', async ({ page }) => {
        const html = await page.evaluate(() =>
            $.getHtml([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ]));

        expect(html).toBe('<span>Test</span>');
    });
});
