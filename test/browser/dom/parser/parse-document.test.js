import { expect, test } from '#test';
import { resetPage } from '../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#parseDocument', () => {
    test('parses a HTML string', async ({ page }) => {
        const html = await page.evaluate(() => {
            const parsedDocument = $.parseDocument(
                '<html><head></head><body><div></div></body></html>',
            );

            return parsedDocument.documentElement.outerHTML;
        });

        expect(html).toBe('<html><head></head><body><div></div></body></html>');
    });

    test('parses an XML string', async ({ page }) => {
        const xml = await page.evaluate(() => {
            const parsedDocument = $.parseDocument(
                '<?xml version="1.0" encoding="UTF-8" ?><container><content></content></container>',
                { contentType: 'text/xml' },
            );

            return parsedDocument.documentElement.outerHTML;
        });

        expect(xml).toBe('<container><content/></container>');
    });
});
