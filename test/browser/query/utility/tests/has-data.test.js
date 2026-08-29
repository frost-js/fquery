import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #hasData', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1" class="test"></div>' +
                '<div id="div2"></div>' +
                '<div id="div3" class="test"></div>' +
                '<div id="div4"></div>';
            $.setData('#div1', 'test1', 'Test 1');
            $.setData('#div3', 'test2', 'Test 2');
        });
    });

    test('returns true if any node has data', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .hasData())).toBe(true);
    });

    test('returns false if no nodes have data', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div:not(.test)')
                    .hasData())).toBe(false);
    });

    test('returns true if any node has data for a key', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#div1')
                    .hasData('test1'))).toBe(true);
    });

    test('returns false if no nodes have data for a key', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('#div1')
                    .hasData('test2'))).toBe(false);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            $.setData(fragment, 'test', 'Test');
            return $(fragment)
                    .hasData();
        })).toBe(true);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            $.setData(shadow, 'test', 'Test');
            return $(shadow)
                    .hasData();
        })).toBe(true);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setData(document, 'test', 'Test');
            return $(document)
                    .hasData();
        })).toBe(true);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setData(window, 'test', 'Test');
            return $(window)
                    .hasData();
        })).toBe(true);
    });
});
