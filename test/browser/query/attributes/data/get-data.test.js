import { getDataTests, setup } from '#cases/attributes/data/get-data.js';
import { expect, test } from '#test';

test.describe('QuerySet #getData', () => {
    test.beforeEach(setup);

    getDataTests(([nodes, ...args]) => $(nodes).getData(...args));

    for (const key of ['constructor', 'toString', '__proto__']) {
        test(`does not return an inherited ${key} property`, async ({ page }) => {
            expect(await page.evaluate((key) =>
                $('div').getData(key) === undefined, key)).toBe(true);
        });
    }

    test('works with DocumentFragment nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const fragment = document.createDocumentFragment();
            $.setData(fragment, 'test', 'Test 2');
            return $(fragment).getData('test');
        })).toBe('Test 2');
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            $.setData(shadow, 'test', 'Test 2');
            return $(shadow).getData('test');
        })).toBe('Test 2');
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setData(document, 'test', 'Test 2');
            return $(document).getData('test');
        })).toBe('Test 2');
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.setData(window, 'test', 'Test 2');
            return $(window).getData('test');
        })).toBe('Test 2');
    });
});
