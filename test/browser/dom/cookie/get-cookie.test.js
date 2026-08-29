import { expect, test } from '#test';
import { resetPage } from '../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#getCookie', () => {
    test('returns a cookie value', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const myDoc = {
                cookie: 'test=Test',
                nodeType: Node.DOCUMENT_NODE,
            };
            $.setContext(myDoc);
            return $.getCookie('test');
        })).toBe('Test');
    });

    test('returns a cookie value from multiple cookie values', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const myDoc = {
                cookie: 'test1=Test 1;test2=Test 2;test3=Test 3',
                nodeType: Node.DOCUMENT_NODE,
            };
            $.setContext(myDoc);
            return [
                $.getCookie('test1'),
                $.getCookie('test2'),
                $.getCookie('test3'),
            ];
        })).toEqual([
            'Test 1',
            'Test 2',
            'Test 3',
        ]);
    });

    test('returns null when the cookie does not exist', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const myDoc = {
                cookie: 'test1=Test 1',
                nodeType: Node.DOCUMENT_NODE,
            };
            $.setContext(myDoc);
            return $.getCookie('test');
        })).toBeNull();
    });

    test('matches the exact cookie name', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const myDoc = {
                cookie: 'test1=Test 1; test=Test 2',
                nodeType: Node.DOCUMENT_NODE,
            };
            $.setContext(myDoc);
            return $.getCookie('test');
        })).toBe('Test 2');
    });

    test('decodes the cookie value', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const myDoc = {
                cookie: 'test=Test%20value%3B%20100%25',
                nodeType: Node.DOCUMENT_NODE,
            };
            $.setContext(myDoc);
            return $.getCookie('test');
        })).toBe('Test value; 100%');
    });
});
