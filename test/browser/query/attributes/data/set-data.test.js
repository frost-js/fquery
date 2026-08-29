import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #setData', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1"></div>' +
                '<div id="test2"></div>';
        });
    });

    test('sets a data object for all nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $('div')
                    .setData({
                        testA: 'Test 1',
                        testB: 'Test 2',
                    });
            return [
                $.getData('#test1'),
                $.getData('#test2'),
            ];
        })).toEqual([
            {
                testA: 'Test 1',
                testB: 'Test 2',
            },
            {
                testA: 'Test 1',
                testB: 'Test 2',
            },
        ]);
    });

    test('sets data for all nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $('div')
                    .setData('test', 'Test 1');
            return [
                $.getData('#test1'),
                $.getData('#test2'),
            ];
        })).toEqual([
            {
                test: 'Test 1',
            },
            {
                test: 'Test 1',
            },
        ]);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.setData('test', 'Test 1');
        })).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            $.setData(fragment, 'test', 'Test 1');
            return $(fragment)
                    .getData();
        })).toEqual({
            test: 'Test 1',
        });
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            $.setData(shadow, 'test', 'Test 1');
            return $(shadow)
                    .getData();
        })).toEqual({
            test: 'Test 1',
        });
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setData(document, 'test', 'Test 1');
            return $(document)
                    .getData();
        })).toEqual({
            test: 'Test 1',
        });
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setData(window, 'test', 'Test 1');
            return $(window)
                    .getData();
        })).toEqual({
            test: 'Test 1',
        });
    });
});
