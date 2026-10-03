import { removeDataTests, setup } from '#cases/attributes/data/remove-data.js';
import { expect, test } from '#test';

test.describe('QuerySet #removeData', () => {
    test.beforeEach(setup);

    removeDataTests(([nodes, ...args]) => {
        $(nodes).removeData(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate(() => {
            const query = $('div');
            return query === query.removeData('testA');
        })).toBe(true);
    });

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate(() => {
            const fragment = document.createDocumentFragment();
            $.setData(fragment, {
                testA: 'Test 1',
                testB: 'Test 2',
            });
            $(fragment).removeData('testA');
            return $.getData(fragment);
        })).toEqual({
            testB: 'Test 2',
        });
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate(() => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            $.setData(shadow, {
                testA: 'Test 1',
                testB: 'Test 2',
            });
            $(shadow).removeData('testA');
            return $.getData(shadow);
        })).toEqual({
            testB: 'Test 2',
        });
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate(() => {
            $.setData(document, {
                testA: 'Test 1',
                testB: 'Test 2',
            });
            $(document).removeData('testA');
            return $.getData(document);
        })).toEqual({
            testB: 'Test 2',
        });
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate(() => {
            $.setData(window, {
                testA: 'Test 1',
                testB: 'Test 2',
            });
            $(window).removeData('testA');
            return $.getData(window);
        })).toEqual({
            testB: 'Test 2',
        });
    });
});
