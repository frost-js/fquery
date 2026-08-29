import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #getData', () => {
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
            $('div')
                    .getData())).toEqual({
            test: 'Test 1',
        });
    });

    test('returns data for the first node', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .getData('test'))).toBe('Test 1');
    });

    test('returns undefined for an undefined key', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .getData('invalid'))).toBe(undefined);
    });

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#invalid')
                    .getData('test'))).toBe(undefined);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            $.setData(fragment, 'test', 'Test 2');
            return $(fragment)
                    .getData('test');
        })).toBe('Test 2');
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            $.setData(shadow, 'test', 'Test 2');
            return $(shadow)
                    .getData('test');
        })).toBe('Test 2');
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setData(document, 'test', 'Test 2');
            return $(document)
                    .getData('test');
        })).toBe('Test 2');
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setData(window, 'test', 'Test 2');
            return $(window)
                    .getData('test');
        })).toBe('Test 2');
    });
});
