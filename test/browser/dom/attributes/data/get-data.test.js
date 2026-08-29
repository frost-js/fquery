import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#getData', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1"></div>' +
                '<div id="test2"></div>';
            $.setData('#test1', 'test', 'Test 1');
        });
    });

    test('returns an object with all data for the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.getData('div'))).toEqual({
            test: 'Test 1',
        });
    });

    test('returns data for the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.getData('div', 'test'))).toBe('Test 1');
    });

    test('returns undefined for an undefined key', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.getData('div', 'invalid'))).toBe(undefined);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.getData('#invalid', 'test'))).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.getData(
                document.getElementById('test1'),
                'test',
            ))).toBe('Test 1');
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.getData(
                document.querySelectorAll('div'),
                'test',
            ))).toBe('Test 1');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.getData(
                document.body.children,
                'test',
            ))).toBe('Test 1');
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            $.setData(fragment, 'test', 'Test 2');
            return $.getData(fragment, 'test');
        })).toBe('Test 2');
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            $.setData(shadow, 'test', 'Test 2');
            return $.getData(shadow, 'test');
        })).toBe('Test 2');
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setData(document, 'test', 'Test 2');
            return $.getData(document, 'test');
        })).toBe('Test 2');
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setData(window, 'test', 'Test 2');
            return $.getData(window, 'test');
        })).toBe('Test 2');
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.getData([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'test'))).toBe('Test 1');
    });
});
