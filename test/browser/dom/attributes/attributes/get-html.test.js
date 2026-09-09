import { getHTMLTests, setup } from '#cases/attributes/attributes/get-html.js';
import { expect, test } from '#test';

test.describe('#getHTML', () => {
    test.beforeEach(setup);

    getHTMLTests((nodes) => $.getHTML(nodes));

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
