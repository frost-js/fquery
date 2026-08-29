import { expect, test } from '#test';
import { resetPage } from '../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#setCookie', () => {
    test('sets a cookie', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const myDoc = {
                cookie: '',
                nodeType: Node.DOCUMENT_NODE,
            };
            $.setContext(myDoc);
            $.setCookie('test', 'Test');
            return myDoc.cookie;
        })).toBe('test=Test');
    });

    test('encodes the cookie value', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const myDoc = {
                cookie: '',
                nodeType: Node.DOCUMENT_NODE,
            };
            $.setContext(myDoc);
            $.setCookie('test', 'Test value; 100%');
            return myDoc.cookie;
        })).toBe('test=Test%20value%3B%20100%25');
    });

    test('sets a cookie with expiration', async ({ page }) => {
        const cookie = await page.evaluate((_) => {
            const myDoc = {
                cookie: '',
                nodeType: Node.DOCUMENT_NODE,
            };
            $.setContext(myDoc);
            $.setCookie('test', 'Test', { expires: 3600 });
            return myDoc.cookie;
        });

        const match = cookie.match(/test=Test;expires=(.*)/);

        expect(match).toBeTruthy();

        const dateString = match[1];
        const timestamp = new Date(dateString).getTime();

        const now = new Date().getTime();
        expect(now + 3540000 < timestamp && now + 3660000 > timestamp).toBeTruthy();
    });

    test('sets a cookie with path', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const myDoc = {
                cookie: '',
                nodeType: Node.DOCUMENT_NODE,
            };
            $.setContext(myDoc);
            $.setCookie('test', 'Test', { path: '/test' });
            return myDoc.cookie;
        })).toBe('test=Test;path=/test');
    });

    test('sets a cookie with secure', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const myDoc = {
                cookie: '',
                nodeType: Node.DOCUMENT_NODE,
            };
            $.setContext(myDoc);
            $.setCookie('test', 'Test', { secure: true });
            return myDoc.cookie;
        })).toBe('test=Test;secure');
    });
});
