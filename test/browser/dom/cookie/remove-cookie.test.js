import { expect, test } from '#test';
import { resetPage } from '../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#removeCookie', () => {
    test('removes a cookie', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const myDoc = {
                cookie: 'test=Test',
                nodeType: Node.DOCUMENT_NODE,
            };
            $.setContext(myDoc);
            $.removeCookie('test');
            return myDoc.cookie;
        })).toBe('test=;expires=Thu, 01 Jan 1970 00:00:00 UTC');
    });

    test('removes a cookie with path', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const myDoc = {
                cookie: 'test=Test',
                nodeType: Node.DOCUMENT_NODE,
            };
            $.setContext(myDoc);
            $.removeCookie('test', { path: '/test' });
            return myDoc.cookie;
        })).toBe('test=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/test');
    });

    test('removes a cookie with secure', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const myDoc = {
                cookie: 'test=Test',
                nodeType: Node.DOCUMENT_NODE,
            };
            $.setContext(myDoc);
            $.removeCookie('test', { secure: true });
            return myDoc.cookie;
        })).toBe('test=;expires=Thu, 01 Jan 1970 00:00:00 UTC;secure');
    });
});
